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
    
    const plainText = this.stripHtml(text);
    if (!plainText.trim()) return { fromCache: true };
    
    const cacheKey = `${voice}:${plainText}`;
    
    // Check memory cache first
    if (this.audioCache.has(cacheKey)) {
      await this.updateLastUsed(cacheKey); // Update LRU
      const blob = this.audioCache.get(cacheKey);
      const audio = new Audio(URL.createObjectURL(blob));
      
      // Wait for audio to finish playing, not just start
      await new Promise((resolve) => {
        const onEnded = () => {
          URL.revokeObjectURL(audio.src);
          audio.removeEventListener('ended', onEnded);
          resolve();
        };
        audio.addEventListener('ended', onEnded);
        audio.play().catch(() => resolve()); // Resolve on error too
      });
      
      return { fromCache: true };
    }
    
    // Check IndexedDB cache
    const cachedItem = await this.getFromDB(cacheKey);
    if (cachedItem) {
      this.audioCache.set(cacheKey, cachedItem.blob);
      await this.updateLastUsed(cacheKey);
      const audio = new Audio(URL.createObjectURL(cachedItem.blob));
      
      // Wait for audio to finish playing, not just start
      await new Promise((resolve) => {
        const onEnded = () => {
          URL.revokeObjectURL(audio.src);
          audio.removeEventListener('ended', onEnded);
          resolve();
        };
        audio.addEventListener('ended', onEnded);
        audio.play().catch(() => resolve()); // Resolve on error too
      });
      
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
    const audio = new Audio(URL.createObjectURL(audioBlob));
    
    // Wait for audio to finish playing, not just start
    await new Promise((resolve) => {
      const onEnded = () => {
        URL.revokeObjectURL(audio.src);
        audio.removeEventListener('ended', onEnded);
        resolve();
      };
      audio.addEventListener('ended', onEnded);
      audio.play().catch(() => resolve()); // Resolve on error too
    });
    
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
    const plainText = this.stripHtml(text);
    const cacheKey = `${voice}:${plainText}`;
    return this.audioCache.has(cacheKey);
  }

  // Check if text is cached anywhere (memory or IndexedDB) - asynchronous
  static async isCached(text, voice = 'alloy') {
    await this.init();
    
    const plainText = this.stripHtml(text);
    const cacheKey = `${voice}:${plainText}`;
    
    // Check memory cache first (fastest)
    if (this.audioCache.has(cacheKey)) {
      return true;
    }
    
    // Check IndexedDB cache
    const cachedItem = await this.getFromDB(cacheKey);
    return !!cachedItem;
  }

  // Prepare audio for caching without playing (for precaching)
  static async prepareAudio(text, voice = 'alloy') {
    await this.init();
    
    const plainText = this.stripHtml(text);
    if (!plainText.trim()) return { fromCache: true };
    
    const cacheKey = `${voice}:${plainText}`;
    
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

  // Utility: Strip HTML tags
  static stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
}

// Make globally available for debugging
if (typeof window !== 'undefined') {
  window.TtsService = TtsService;
}

export default TtsService;
