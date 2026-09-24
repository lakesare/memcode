const inlineFormats = ['bold', 'italic', 'underline', 'strike', 'script', 'code', 'link', 'answer'];

function exitInlineFormatHandler(range, context) {
  if (range.length > 0) return true;

  const formatOfNextCharacter = this.quill.getFormat(range.index, 1);
  const formatsEndingHere = inlineFormats.filter((name) =>
    context.format[name] && context.format[name] !== formatOfNextCharacter[name]
  );

  if (formatsEndingHere.length === 0) return true;

  formatsEndingHere.forEach((name) => this.quill.format(name, false, 'user'));
  // [claude comment] quill.format() on a collapsed cursor emits no editor-change event, so the toolbar has to be told the formats changed, the same way quill's own toolbar buttons do after formatting
  this.quill.getModule('toolbar').update(this.quill.getSelection());
  return false;
}

export default exitInlineFormatHandler;
