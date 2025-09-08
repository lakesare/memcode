import TtsService from '~/services/ttsService';
import ClozeDeletion from '~/services/ClozeDeletion';

class TtsPrecacheService {
  // Track what's currently being precached to avoid duplicates
  static precachingSet = new Set();
  
  /**
   * Precache TTS audio for upcoming flashcards
   * @param {Array} problems - Array of all problems/flashcards
   * @param {number} currentIndex - Current flashcard index
   * @param {number} count - Number of upcoming flashcards to precache (default: 3)
   */
  static async precacheUpcoming(problems, currentIndex, count = 3) {
    if (!problems || !Array.isArray(problems) || localStorage.getItem('volume') !== 'yes') {
      return; // Skip precaching if no audio enabled
    }
    
    console.log('🚀 Precaching TTS for upcoming flashcards...');
    
    // Get the next `count` problems to precache
    const upcomingProblems = [];
    for (let i = 1; i <= count; i++) {
      const nextIndex = currentIndex + i;
      if (nextIndex < problems.length) {
        upcomingProblems.push({ problem: problems[nextIndex], index: nextIndex });
      }
    }
    
    // Precache each upcoming problem in parallel (but don't await - fire and forget)
    upcomingProblems.forEach(({ problem, index }) => {
      this.precacheProblem(problem, index);
    });
  }
  
  /**
   * Precache TTS audio for a single flashcard problem
   * @param {Object} problem - The flashcard problem object
   * @param {number} index - The problem index (for logging)
   */
  static async precacheProblem(problem, index) {
    if (!problem) return;
    
    const cacheKey = `problem_${problem.id || index}`;
    
    // Skip if already precaching this problem
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
  
  /**
   * Precache all relevant TTS audio for a problem
   */
  static async precacheProblemAudio(problem, index) {
    if (!problem.content?.content) return;
    
    console.log(`📦 Precaching problem ${index}:`, problem.content.content.substring(0, 50) + '...');
    
    const promises = [];
    
    // 1. Precache the full sentence (for regular playback)
    const fullText = ClozeDeletion.stripHtmlTags(problem.content.content);
    promises.push(this.precacheText(fullText, `Problem ${index} full text`));
    
    // For cloze deletion problems, precache succumb sequence variants
    if (problem.type === 'inlinedAnswers') {
      const answers = ClozeDeletion.getAnswerTexts(problem.content.content);
      
      if (answers.length > 0) {
        // 2. Precache individual answer with context (for when user types correct answer)
        for (const answer of answers) {
          const contextualText = `${answer} ${fullText}`;
          promises.push(this.precacheText(contextualText, `Problem ${index} answer context`));
        }
        
        // 3. Precache succumb sequence (word. word??? word!!! sentence) - matches SequenceTtsService.playSuccumbSequence format
        const lastAnswer = answers[answers.length - 1];
        const cleanAnswer = ClozeDeletion.stripHtmlTags(lastAnswer);
        const succumbText = `${cleanAnswer}. ${cleanAnswer}??? ${cleanAnswer}!!! ${fullText}`;
        promises.push(this.precacheText(succumbText, `Problem ${index} succumb sequence`));
      }
    }
    
    // Execute all precaching in parallel
    await Promise.allSettled(promises);
    console.log(`✅ Precached problem ${index}`);
  }
  
  /**
   * Precache a single text by fetching and caching it (but not playing)
   */
  static async precacheText(text, description) {
    try {
      // Check if already cached
      const isCached = await TtsService.isCached(text);
      if (isCached) {
        return; // Already cached, skip
      }
      
      // Use the prepareAudio method to fetch and cache without playing
      await TtsService.prepareAudio(text);
      console.log(`  ✓ Cached: ${description}`);
    } catch (error) {
      console.warn(`  ✗ Failed to cache: ${description}`, error);
    }
  }
  
  /**
   * Alias for precacheUpcoming - precache next problems
   * @param {Array} problems - Array of all problems/flashcards
   * @param {number} currentIndex - Current flashcard index
   * @param {number} count - Number of upcoming flashcards to precache (default: 3)
   */
  static async precacheNextProblems(problems, currentIndex, count = 3) {
    return this.precacheUpcoming(problems, currentIndex, count);
  }
  
  /**
   * Clear the precaching set (useful for debugging)
   */
  static clearPrecachingSet() {
    this.precachingSet.clear();
  }
}

export default TtsPrecacheService;
