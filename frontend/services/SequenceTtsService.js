import TtsService from '~/services/ttsService';
import ClozeDeletion from '~/services/ClozeDeletion';
import noiseAudio from '~/pages/courses_id_review/noise.mp3';

class SequenceTtsService {
  // Cache for the noise audio file
  static noiseAudio = null;
  static noiseLoaded = false;

  // Load the noise audio file once
  static async loadNoiseAudio() {
    if (this.noiseLoaded) return;
    
    try {
      this.noiseAudio = new Audio(noiseAudio);
      this.noiseAudio.preload = 'auto';
      this.noiseLoaded = true;
// Noise audio loaded successfully
    } catch (error) {
      console.warn('Could not load noise audio, falling back to TTS placeholders:', error);
      this.noiseLoaded = false;
    }
  }

  // Play audio sequence for cloze deletion content
  // content: HTML with cloze deletions
  // answerInputs: array of input elements (null = hide all answers with noise)
  static async playSequence(content, answerInputs = null, voice = 'alloy') {
    await this.loadNoiseAudio();
    
    const textParts = ClozeDeletion.splitIntoTextParts(content);
    const answers = ClozeDeletion.getAnswerTexts(content);
    
    let answerIndex = 0;
    
    for (let i = 0; i < textParts.length; i++) {
      const part = textParts[i];
      
      // Check if this part is an answer (odd indices after splitting)
      const isAnswer = answers.includes(part);
      
      if (isAnswer) {
        // Determine if we should play the answer or noise
        let shouldPlayAnswer = false;
        
        if (answerInputs && answerIndex < answerInputs.length) {
          const input = answerInputs[answerIndex];
          shouldPlayAnswer = input.getAttribute('data-answered') === 'right';
        }
        
        if (shouldPlayAnswer) {
          // Play the actual answer text
          const cleanText = ClozeDeletion.stripHtmlTags(part);
          if (this.hasLetters(cleanText)) {
            await TtsService.speakText(cleanText, voice);
          }
        } else {
          // Play noise instead of revealing the answer
          await this.playNoise();
        }
        
        answerIndex++;
      } else {
        // Play regular text part
        const cleanText = ClozeDeletion.stripHtmlTags(part);
        if (this.hasLetters(cleanText)) {
          await TtsService.speakText(cleanText, voice);
        }
      }
      
      // Small pause between parts for better flow
      if (i < textParts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // Play the noise audio file with fade-in/fade-out for smoother transitions
  static async playNoise() {
    if (!this.noiseAudio) {
      // Fallback: use TTS for a short placeholder sound
      await TtsService.speakText('...', 'alloy');
      return;
    }

    return new Promise((resolve) => {
      // Reset audio to beginning
      this.noiseAudio.currentTime = 0;
      
      // Make fade durations shorter for short audio files
      const audioDuration = this.noiseAudio.duration || 2;
      const fadeInDuration = Math.min(0.15, audioDuration * 0.2); // 20% of audio or max 0.15s
      const fadeOutDuration = Math.min(0.15, audioDuration * 0.2); // 20% of audio or max 0.15s
      const maxVolume = 0.3; // Production volume level
      
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
      
      // Start with volume at 0 for fade-in
      this.noiseAudio.volume = 0;
      
      this.noiseAudio.play().then(() => {
        // Fade-in effect (simple linear)
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
            
            // Set up fade-out monitoring
            const fadeOutStartTime = Math.max(fadeInDuration + 0.05, audioDuration - fadeOutDuration);
            
            const checkForFadeOut = setInterval(() => {
              const currentTime = this.noiseAudio.currentTime;
              
              if (currentTime >= fadeOutStartTime && !fadeOutStarted) {
                fadeOutStarted = true;
                clearInterval(checkForFadeOut);
                
                // Fade-out effect (simple linear)
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

  // Experimental: Play succumb sequence (word + word + word + full sentence)
  static async playSuccumbSequence(content, voice = 'alloy') {
    console.log('🎵 SUCCUMB SEQUENCE TRIGGERED!', content);
    const answers = ClozeDeletion.getAnswerTexts(content);
    console.log('Found answers:', answers);
    
    if (answers.length > 0) {
      // Get the last answer (most recently revealed)
      const lastAnswer = answers[answers.length - 1];
      const cleanAnswer = ClozeDeletion.stripHtmlTags(lastAnswer);
      console.log('Playing word 3 times:', cleanAnswer);
      
      if (this.hasLetters(cleanAnswer)) {
        // Play the answer word 3 times with small pauses
        console.log('🔊 Playing word 1/3');
        await TtsService.speakText(cleanAnswer, voice);
        await new Promise(resolve => setTimeout(resolve, 300)); // 300ms pause
        
        console.log('🔊 Playing word 2/3');
        await TtsService.speakText(cleanAnswer, voice);
        await new Promise(resolve => setTimeout(resolve, 300));
        
        console.log('🔊 Playing word 3/3');
        await TtsService.speakText(cleanAnswer, voice);
        await new Promise(resolve => setTimeout(resolve, 500)); // Longer pause before full sentence
      }
    }
    
    // Finally play the full sentence
    console.log('🔊 Playing full sentence');
    const cleanText = ClozeDeletion.stripHtmlTags(content);
    await TtsService.speakText(cleanText, voice);
    console.log('✅ Succumb sequence complete!');
  }

  // For manual play - just use regular TTS with clean text (best caching)
  static async playFullText(content, voice = 'alloy') {
    const cleanText = ClozeDeletion.stripHtmlTags(content);
    return await TtsService.speakText(cleanText, voice);
  }

  // Check if content can be cached (for full text playback)
  static async isFullTextCached(content, voice = 'alloy') {
    const cleanText = ClozeDeletion.stripHtmlTags(content);
    return await TtsService.isCached(cleanText, voice);
  }

  // Check if sequence parts can be cached
  static async isSequenceCached(content, voice = 'alloy') {
    await this.loadNoiseAudio();
    
    const textParts = ClozeDeletion.splitIntoTextParts(content);
    const answers = ClozeDeletion.getAnswerTexts(content);
    
    // Check if all text parts (excluding answers) are cached
    for (const part of textParts) {
      if (!answers.includes(part)) {
        const cleanText = ClozeDeletion.stripHtmlTags(part);
        if (this.hasLetters(cleanText)) {
          const cached = await TtsService.isCached(cleanText, voice);
          if (!cached) return false;
        }
      }
    }
    
    return true;
  }

  // Helper method to check if text contains actual letters (not just punctuation/whitespace)
  static hasLetters(text) {
    return /[a-zA-Z]/.test(text);
  }
}

export default SequenceTtsService;
