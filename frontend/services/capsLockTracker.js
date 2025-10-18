// Global Shift key state tracker
// Used to determine when to skip image compression (Shift press -> release -> paste)

class ShiftKeyTracker {
  constructor() {
    this.wasRecentlyPressed = false;
    this.timeoutId = null;
    this.init();
  }

  init() {
    // Track keydown events globally
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
        // Shift was pressed, mark it but don't set the flag yet
        this.handleShiftPress();
      }
    });

    // Track keyup events globally  
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Shift') {
        // Shift was released, now set the flag for a brief period
        this.handleShiftRelease();
      }
    });
  }

  handleShiftPress() {
    // Clear any existing timeout to reset the state
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  handleShiftRelease() {
    // Set the flag indicating Shift was recently pressed and released
    this.wasRecentlyPressed = true;
    
    // Clear the flag after 3 seconds
    this.timeoutId = setTimeout(() => {
      this.wasRecentlyPressed = false;
      this.timeoutId = null;
    }, 3000);
  }

  // Check if compression should be skipped
  shouldSkipCompression() {
    return this.wasRecentlyPressed;
  }

  // Reset the state (called after paste to prevent affecting future uploads)
  reset() {
    this.wasRecentlyPressed = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// Create a singleton instance
const shiftKeyTracker = new ShiftKeyTracker();

export default shiftKeyTracker;
