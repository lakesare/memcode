// [claude comment] Quill 2 matches keyboard bindings against `event.key`, which is the character the *current layout* produces - so on a Cyrillic (or any non-Latin) layout Ctrl+B arrives as 'и', matches nothing, is never preventDefault'ed, and the browser's own Ctrl+B (bookmarks sidebar) runs instead.
// [claude comment] Browsers keep `event.code` layout-independent, so we rewrite `key` back to the Latin letter of the physical key - but only when the layout gave us a non-Latin character, otherwise we'd break QWERTZ/AZERTY/Dvorak, where Ctrl+Z legitimately sits on a different physical key than 'KeyZ'.
const latinizeShortcutKey = (event) => {
  if (!event.ctrlKey && !event.metaKey) return;
  if (/^[a-z]$/i.test(event.key)) return;

  const physicalLetter = /^Key([A-Z])$/.exec(event.code || '');
  if (!physicalLetter) return;

  const letter = event.shiftKey ? physicalLetter[1] : physicalLetter[1].toLowerCase();
  Object.defineProperty(event, 'key', { value: letter, configurable: true });
};

export default latinizeShortcutKey;
