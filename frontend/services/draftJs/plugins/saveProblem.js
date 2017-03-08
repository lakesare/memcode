import { KeyBindingUtil } from 'draft-js';

const saveProblem = (saveFn) => ({
  keyBindingFn: (event) => {
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 83) { // S
      return 'save';
    }
  },

  handleKeyCommand: (command) => {
    if (command === 'save') {
      saveFn();
      return 'handled';
    }
    return 'not-handled';
  }
});

export { saveProblem };
