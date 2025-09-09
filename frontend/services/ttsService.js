// Simple Text-to-Speech service with storage-based caching
class TtsService {
  // In-memory cache for instant access
  static audioCache = new Map();
  
  // Storage limits
  static MAX_CACHE_STORAGE = 0; // Will be set to availableStorage/2
  static currentCacheSize = 0;  // Track actual storage used
  
  // IndexedDB setup
  static DB_NAME = 'MemcodeTTSCache';
  static STORE_NAME = 'audioCache';
  static db = null;
  static initialized = false;

  // Initialize and set storage limits
  static async init() {
    if (this.initialized) return;
    
    // Set max cache storage to 50% of available space
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const availableSpace = estimate.quota - (estimate.usage || 0);
        this.MAX_CACHE_STORAGE = availableSpace / 2;
      } else {
        this.MAX_CACHE_STORAGE = 100 * 1024 * 1024; // 100MB fallback
      }
    } catch (error) {
      this.MAX_CACHE_STORAGE = 100 * 1024 * 1024; // 100MB fallback
    }
    
    // Open IndexedDB
    this.db = await this.openDB();
    await this.loadCache();
    this.initialized = true;
  }

  // Open IndexedDB
  static openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
        store.createIndex('lastUsed', 'lastUsed', { unique: false });
        store.createIndex('size', 'size', { unique: false });
      };
    });
  }

  // Load cache from IndexedDB and calculate current size
  static async loadCache() {
    const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    const items = await this.getAllFromStore(store);
    
    this.currentCacheSize = 0;
    
    // Load recent items into memory cache
    items
      .sort((a, b) => b.lastUsed - a.lastUsed) // Most recent first
      .slice(0, 100) // Only keep 100 most recent in memory
      .forEach(item => {
        this.audioCache.set(item.key, item.blob);
        this.currentCacheSize += item.size;
      });
      
    // Calculate total storage used
    this.currentCacheSize = items.reduce((total, item) => total + item.size, 0);
  }

  // Get all items from IndexedDB store
  static getAllFromStore(store) {
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  // Main TTS function
  static async speakText(text, voice = 'alloy') {
    await this.init();
    
    const plainText = this.prepareTextForTts(text);
    if (!plainText) return { fromCache: true };
    
    const cacheKey = this.createCacheKey(text);
    
    // Check memory cache first
    if (this.audioCache.has(cacheKey)) {
      await this.updateLastUsed(cacheKey);
      const blob = this.audioCache.get(cacheKey);
      await this.playAudioBlob(blob);
      return { fromCache: true };
    }
    
    // Check IndexedDB cache
    const cachedItem = await this.getFromDB(cacheKey);
    if (cachedItem) {
      this.audioCache.set(cacheKey, cachedItem.blob);
      await this.updateLastUsed(cacheKey);
      await this.playAudioBlob(cachedItem.blob);
      return { fromCache: true };
    }
    
    // Fetch from API
    const response = await fetch('/api/TtsApi.generateSpeech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: plainText, voice })
    });
    
    if (!response.ok) throw new Error('TTS request failed');
    
    const audioBlob = await response.blob();
    
    // Cache the new audio
    await this.cacheAudio(cacheKey, audioBlob);
    
    // Play audio
    await this.playAudioBlob(audioBlob);
    
    return { fromCache: false };
  }

  // Cache audio with storage-based LRU pruning
  static async cacheAudio(key, blob) {
    const blobSize = blob.size;
    
    // Add to memory cache
    this.audioCache.set(key, blob);
    
    // Prune old items if we exceed storage limit
    while (this.currentCacheSize + blobSize > this.MAX_CACHE_STORAGE) {
      await this.pruneOldestItem();
    }
    
    // Save to IndexedDB
    await this.saveToDB(key, blob, blobSize);
    this.currentCacheSize += blobSize;
  }

  // Remove least recently used item
  static async pruneOldestItem() {
    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    const index = store.index('lastUsed');
    
    // Get oldest item
    const request = index.openCursor();
    
    return new Promise((resolve) => {
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const item = cursor.value;
          this.currentCacheSize -= item.size;
          this.audioCache.delete(item.key);
          cursor.delete();
        }
        resolve();
      };
      request.onerror = () => resolve();
    });
  }

  // Save to IndexedDB
  static async saveToDB(key, blob, size) {
    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    
    const item = {
      key,
      blob,
      size,
      lastUsed: Date.now()
    };
    
    store.put(item);
  }

  // Get from IndexedDB
  static async getFromDB(key) {
    const transaction = this.db.transaction([this.STORE_NAME], 'readonly');
    const store = transaction.objectStore(this.STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  }

  // Update last used timestamp (for LRU)
  static async updateLastUsed(key) {
    const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
    const store = transaction.objectStore(this.STORE_NAME);
    
    const getRequest = store.get(key);
    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.lastUsed = Date.now();
        store.put(item);
      }
    };
  }

  // Quick memory cache check (synchronous)
  static isInMemoryCache(text, voice = 'alloy') {
    const cacheKey = this.createCacheKey(text);
    return cacheKey ? this.audioCache.has(cacheKey) : false;
  }

  // Check if text is cached anywhere (memory or IndexedDB) - asynchronous
  static async isCached(text, voice = 'alloy') {
    await this.init();
    
    const cacheKey = this.createCacheKey(text);
    if (!cacheKey) return true;
    
    if (this.audioCache.has(cacheKey)) {
      return true;
    }
    
    const cachedItem = await this.getFromDB(cacheKey);
    return !!cachedItem;
  }

  // Prepare audio for caching without playing (for precaching)
  static async prepareAudio(text, voice = 'alloy') {
    await this.init();
    
    const plainText = this.prepareTextForTts(text);
    if (!plainText) return { fromCache: true };
    
    const cacheKey = this.createCacheKey(text);
    
    // Check if already cached (memory or IndexedDB)
    if (this.audioCache.has(cacheKey)) {
      await this.updateLastUsed(cacheKey);
      return { fromCache: true };
    }
    
    const cachedItem = await this.getFromDB(cacheKey);
    if (cachedItem) {
      this.audioCache.set(cacheKey, cachedItem.blob);
      await this.updateLastUsed(cacheKey);
      return { fromCache: true };
    }
    
    // Fetch from API and cache (but don't play)
    const response = await fetch('/api/TtsApi.generateSpeech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: plainText, voice })
    });
    
    if (!response.ok) throw new Error('TTS request failed');
    
    const audioBlob = await response.blob();
    
    // Cache the new audio
    await this.cacheAudio(cacheKey, audioBlob);
    
    return { fromCache: false };
  }

  // Clear all caches
  static async clearCache() {
    this.audioCache.clear();
    this.currentCacheSize = 0;
    
    if (this.db) {
      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.clear();
    }
  }

  // Get cache stats
  static getCacheStats() {
    return {
      memoryItems: this.audioCache.size,
      storageSizeMB: (this.currentCacheSize / 1024 / 1024).toFixed(1),
      maxStorageMB: (this.MAX_CACHE_STORAGE / 1024 / 1024).toFixed(1),
      storagePercent: ((this.currentCacheSize / this.MAX_CACHE_STORAGE) * 100).toFixed(1)
    };
  }

  // Utility functions
  static stripHtml(html) {
    if (!html) return '';
    
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  static hasLetters(text) {
    return /[a-zA-Z]/.test(text);
  }

  static prepareTextForTts(text) {
    if (!text) return null;
    
    const cleanText = this.stripHtml(text).trim();
    return this.hasLetters(cleanText) ? cleanText : null;
  }

  static async playAudioBlob(blob) {
    if (!blob) return;

    const audio = new Audio(URL.createObjectURL(blob));
    
    return new Promise((resolve) => {
      const cleanup = () => {
        URL.revokeObjectURL(audio.src);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
      };

      const onEnded = () => {
        cleanup();
        resolve();
      };

      const onError = (error) => {
        console.warn('Audio playback error:', error);
        cleanup();
        resolve();
      };

      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      
      audio.play().catch(onError);
    });
  }

  static createCacheKey(text) {
    return this.prepareTextForTts(text);
  }

  static isVolumeEnabled() {
    return localStorage.getItem('volume') === 'yes';
  }

  // Cloze deletion utilities
  static CLOZE_ANSWER_REGEX = /<mark class="answer">(.*?)<\/mark>/g;
  static CLOZE_ANSWER_FULL_REGEX = /<mark class="answer">[^<]*<\/mark>/g;
  static CLOZE_PLACEHOLDER = '... ffffffffff... ';

  static getAnswerTexts(content) {
    const matches = content.match(this.CLOZE_ANSWER_REGEX);
    if (!matches) return [];

    return matches.map(match => {
      const answerMatch = match.match(/<mark class="answer">(.*?)<\/mark>/);
      return answerMatch ? answerMatch[1] : '';
    }).filter(answer => answer.length > 0);
  }

  static countAnswerBlanks(content) {
    const matches = content.match(this.CLOZE_ANSWER_FULL_REGEX);
    return matches ? matches.length : 0;
  }

  static hideUnsolvedAnswers(content, answerInputs) {
    if (!answerInputs || answerInputs.length === 0) {
      return content.replace(this.CLOZE_ANSWER_FULL_REGEX, this.CLOZE_PLACEHOLDER);
    }

    let replacementIndex = 0;
    return content.replace(this.CLOZE_ANSWER_REGEX, (match, originalAnswer) => {
      if (replacementIndex < answerInputs.length) {
        const input = answerInputs[replacementIndex];
        const answeredState = input.getAttribute('data-answered');
        
        if (answeredState === 'right') {
          const replacement = input.value || originalAnswer;
          replacementIndex++;
          return replacement;
        } else {
          replacementIndex++;
          return this.CLOZE_PLACEHOLDER;
        }
      }
      replacementIndex++;
      return this.CLOZE_PLACEHOLDER;
    });
  }

  static splitIntoTextParts(content) {
    const parts = [];
    let lastIndex = 0;
    
    let match;
    const regex = new RegExp(this.CLOZE_ANSWER_REGEX.source, 'g');
    
    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        if (textBefore) parts.push(textBefore);
      }
      
      parts.push(match[1]);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      const textAfter = content.slice(lastIndex);
      if (textAfter) parts.push(textAfter);
    }
    
    return parts.filter(part => part.length > 0);
  }

  // Sequence TTS functionality
  static noiseAudio = null;
  static noiseLoaded = false;

  static async loadNoiseAudio() {
    if (this.noiseLoaded) return;
    
    try {
      // Use webpack require to get the processed file path
      const noiseUrl = require('../pages/courses_id_review/noise.mp3');
      this.noiseAudio = new Audio(noiseUrl);
      this.noiseAudio.preload = 'auto';
      this.noiseLoaded = true;
    } catch (error) {
      console.warn('Could not load noise audio, falling back to TTS placeholders:', error);
      this.noiseLoaded = false;
    }
  }

  static async playNoise() {
    if (!this.noiseAudio) {
      await this.speakText('...', 'alloy');
      return;
    }

    return new Promise((resolve) => {
      this.noiseAudio.currentTime = 0;
      
      const audioDuration = this.noiseAudio.duration || 2;
      const fadeInDuration = Math.min(0.15, audioDuration * 0.2);
      const fadeOutDuration = Math.min(0.15, audioDuration * 0.2);
      const maxVolume = 0.3;
      
      let fadeInterval = null;
      
      const cleanup = () => {
        if (fadeInterval) clearInterval(fadeInterval);
        this.noiseAudio.removeEventListener('ended', onEnded);
        this.noiseAudio.removeEventListener('error', onError);
      };
      
      const onEnded = () => {
        cleanup();
        resolve();
      };
      
      const onError = (error) => {
        console.error('Noise audio error:', error);
        cleanup();
        resolve();
      };
      
      this.noiseAudio.addEventListener('ended', onEnded);
      this.noiseAudio.addEventListener('error', onError);
      
      this.noiseAudio.volume = 0;
      
      this.noiseAudio.play().then(() => {
        const fadeInSteps = 10;
        const fadeInStepSize = maxVolume / fadeInSteps;
        const fadeInInterval = fadeInDuration * 1000 / fadeInSteps;
        
        let currentVolume = 0;
        let fadeOutStarted = false;
        
        fadeInterval = setInterval(() => {
          currentVolume += fadeInStepSize;
          if (currentVolume >= maxVolume) {
            currentVolume = maxVolume;
            clearInterval(fadeInterval);
            
            const fadeOutStartTime = Math.max(fadeInDuration + 0.05, audioDuration - fadeOutDuration);
            
            const checkForFadeOut = setInterval(() => {
              const currentTime = this.noiseAudio.currentTime;
              
              if (currentTime >= fadeOutStartTime && !fadeOutStarted) {
                fadeOutStarted = true;
                clearInterval(checkForFadeOut);
                
                const fadeOutSteps = 10;
                const fadeOutStepSize = maxVolume / fadeOutSteps;
                const fadeOutIntervalMs = fadeOutDuration * 1000 / fadeOutSteps;
                
                fadeInterval = setInterval(() => {
                  currentVolume -= fadeOutStepSize;
                  if (currentVolume <= 0) {
                    currentVolume = 0;
                    clearInterval(fadeInterval);
                  }
                  this.noiseAudio.volume = Math.max(0, currentVolume);
                }, fadeOutIntervalMs);
              }
            }, 10);
          }
          this.noiseAudio.volume = Math.min(maxVolume, currentVolume);
        }, fadeInInterval);
        
      }).catch((error) => {
        console.error('Noise audio play() failed:', error);
        cleanup();
        resolve();
      });
    });
  }

  static async playSequence(content, answerInputs = null, voice = 'alloy') {
    await this.loadNoiseAudio();
    
    const textParts = this.splitIntoTextParts(content);
    const answers = this.getAnswerTexts(content);
    
    let answerIndex = 0;
    
    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      const isAnswer = answers.includes(part);
      
      if (isAnswer) {
        let shouldPlayAnswer = false;
        
        if (answerInputs && answerIndex < answerInputs.length) {
          const input = answerInputs[answerIndex];
          shouldPlayAnswer = input.getAttribute('data-answered') === 'right';
        }
        
        if (shouldPlayAnswer) {
          const cleanText = this.prepareTextForTts(part);
          if (cleanText) {
            await this.speakText(cleanText, voice);
          }
        } else {
          await this.playNoise();
        }
        
        answerIndex++;
      } else {
        const cleanText = this.prepareTextForTts(part);
        if (cleanText) {
          await this.speakText(cleanText, voice);
        }
      }
      
      if (i < textParts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  static async playSuccumbSequence(content, voice = 'alloy') {
    console.log('🎵 SUCCUMB SEQUENCE TRIGGERED!', content);
    const answers = this.getAnswerTexts(content);
    console.log('Found answers:', answers);
    
    const cleanText = this.stripHtml(content);
    
    if (answers.length > 0) {
      const validAnswers = answers
        .map(answer => this.prepareTextForTts(answer))
        .filter(Boolean);
      
      if (validAnswers.length > 0) {
        const answerRepetitions = validAnswers.map(answer => 
          `${answer}. ${answer}??? ${answer}!!!`
        ).join(' ');
        
        const contextualText = `${answerRepetitions} ${cleanText}`;
        console.log('🔊 Playing succumb sequence:', contextualText);
        
        await this.speakText(contextualText, voice);
        console.log('✅ Succumb sequence complete!');
        return;
      }
    }
    
    console.log('🔊 Fallback: Playing full sentence only');
    await this.speakText(cleanText, voice);
    console.log('✅ Succumb sequence complete!');
  }

  // Precaching functionality
  static precachingSet = new Set();

  static async precacheUpcoming(problems, currentIndex, count = 3) {
    if (!problems || !Array.isArray(problems) || !this.isVolumeEnabled()) {
      return;
    }
    
    console.log('🚀 Precaching TTS for upcoming flashcards...');
    
    const upcomingProblems = [];
    for (let i = 1; i <= count; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < problems.length) {
        upcomingProblems.push({ problem: problems[nextIndex], index: nextIndex });
      }
    }
    
    upcomingProblems.forEach(({ problem, index }) => {
      this.precacheProblem(problem, index);
    });
  }

  static async precacheProblem(problem, index) {
    if (!problem) return;
    
    const cacheKey = `problem_${problem.id || index}`;
    
    if (this.precachingSet.has(cacheKey)) {
      return;
    }
    
    this.precachingSet.add(cacheKey);
    
    try {
      await this.precacheProblemAudio(problem, index);
    } catch (error) {
      console.warn(`Failed to precache problem ${index}:`, error);
    } finally {
      this.precachingSet.delete(cacheKey);
    }
  }

  static async precacheProblemAudio(problem, index) {
    if (!problem.content?.content) return;
    
    console.log(`📦 Precaching problem ${index}:`, problem.content.content.substring(0, 50) + '...');
    
    const promises = [];
    
    if (problem.type === 'inlinedAnswers') {
      const answers = this.getAnswerTexts(problem.content.content);
      
      if (answers.length > 0) {
        const fullText = this.stripHtml(problem.content.content);
        const validAnswers = answers
          .map(answer => this.prepareTextForTts(answer))
          .filter(Boolean);
        
        if (validAnswers.length > 0) {
          const answerRepetitions = validAnswers.map(answer => 
            `${answer}. ${answer}??? ${answer}!!!`
          ).join(' ');
          const succumbText = `${answerRepetitions} ${fullText}`;
          
          promises.push(this.precacheText(succumbText, `Problem ${index} succumb sequence`));
        }
      }
    } else if (problem.type === 'separateAnswer') {
      const fullText = this.stripHtml(problem.content.content);
      if (fullText) {
        promises.push(this.precacheText(fullText, `Problem ${index} full text`));
      }
    }
    
    await Promise.allSettled(promises);
    console.log(`✅ Precached problem ${index}`);
  }

  static async precacheText(text, description) {
    try {
      const isCached = await this.isCached(text);
      if (isCached) {
        return;
      }
      
      await this.prepareAudio(text);
      console.log(`  ✓ Cached: ${description}`);
    } catch (error) {
      console.warn(`  ✗ Failed to cache: ${description}`, error);
    }
  }

  static async precacheNextProblems(problems, currentIndex, count = 3) {
    return this.precacheUpcoming(problems, currentIndex, count);
  }

  // Simple method to play full text (used by playAutoTts)
  static async playFullText(text, voice = 'alloy') {
    const cleanText = this.prepareTextForTts(text);
    if (cleanText) {
      await this.speakText(cleanText, voice);
    }
  }

  static clearPrecachingSet() {
    this.precachingSet.clear();
  }
}

// Make globally available for debugging
if (typeof window !== 'undefined') {
  window.TtsService = TtsService;
}

export default TtsService;
