const readFiles = (files, callback) => {
  [].forEach.call(files, file => {
    const type = file.type;
    if (!file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      callback(e.target.result, type);
    };
    const blob = file.getAsFile ? file.getAsFile() : file;
    if (blob instanceof Blob) reader.readAsDataURL(blob);
  });
};

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
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      readFiles(e.dataTransfer.files, (dataUrl, type) => {
        this.options.handler(dataUrl, type, this.quill);
      });
    }
  }

  handlePaste(e) {
    e.preventDefault();
    if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
      readFiles(e.clipboardData.items, (dataUrl, type) => {
        this.options.handler(dataUrl, type, this.quill);
      });
    }
  }
}

export default moduleDropOrPasteImage;
