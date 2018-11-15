import toArray from '~/services/toArray';
const imageRegex = /^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i;


export class moduleDropOrPasteImage {
  constructor(quill, options = {}) {
    this.quill = quill;
    this.options = options;

    this.handleDrop = this.handleDrop.bind(this);
    this.quill.root.addEventListener('drop', this.handleDrop, false);

    this.handlePaste = this.handlePaste.bind(this);
    this.quill.root.addEventListener('paste', this.handlePaste, false);
  }

  handleDrop(e) {
    e.preventDefault();
    const inserts = toArray(e.dataTransfer.files);
    const files = inserts.filter((file) =>
      file.type.match(imageRegex)
    );
    files.forEach((file) => this.options.handler(file, this.quill));
  }

  handlePaste(e) {
    // not .items! .files!!!
    const inserts = toArray(e.clipboardData.files);
    const files = inserts.filter((file) =>
      file.type.match(imageRegex)
    );
    // if at least one insert is an image! otherwise it may be plain text, and we should insert it as is!
    if (files.length > 0) {
      console.log(files);
      e.preventDefault();
      files.forEach((file) => this.options.handler(file, this.quill));
    }
  }
}

export default moduleDropOrPasteImage;
