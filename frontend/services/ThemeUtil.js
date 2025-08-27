// Theme utility functions for managing application theme
// This ensures theme is applied consistently across the entire application

export default {
  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(savedTheme);
  },

  applyTheme(theme) {
    const bodyEl = document.body;
    if (theme === 'bright') {
      bodyEl.classList.add("-bright-theme");
    } else {
      bodyEl.classList.remove("-bright-theme");
    }
  },

  toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'bright' : 'dark';
    localStorage.setItem('theme', newTheme);
    this.applyTheme(newTheme);
    return newTheme;
  },

  getCurrentTheme() {
    return localStorage.getItem('theme') || 'dark';
  }
};
