const inlineFormats = ['bold', 'italic', 'underline', 'strike', 'script', 'code', 'link', 'answer'];

function turnOffFormats(quill, formats) {
  formats.forEach((name) => quill.format(name, false, 'user'));
  // [claude comment] quill.format() on a collapsed cursor emits no editor-change event, so the toolbar has to be told the formats changed, the same way quill's own toolbar buttons do after formatting
  quill.getModule('toolbar').update(quill.getSelection());
}

function exitInlineFormatOnArrowRight(range, context) {
  if (range.length > 0) return true;

  const formatOfNextCharacter = this.quill.getFormat(range.index, 1);
  const formatsEndingHere = inlineFormats.filter((name) =>
    context.format[name] && context.format[name] !== formatOfNextCharacter[name]
  );

  if (formatsEndingHere.length === 0) return true;

  turnOffFormats(this.quill, formatsEndingHere);
  return false;
}

// [claude comment] only at the start of a line does typed text take the format of the character after the cursor - mid-line it takes the format of the character before
function exitInlineFormatOnArrowLeft(range, context) {
  if (range.length > 0 || context.offset > 0) return true;

  const formatsStartingHere = inlineFormats.filter((name) => context.format[name]);

  if (formatsStartingHere.length === 0) return true;

  turnOffFormats(this.quill, formatsStartingHere);
  return false;
}

export { exitInlineFormatOnArrowRight, exitInlineFormatOnArrowLeft };
