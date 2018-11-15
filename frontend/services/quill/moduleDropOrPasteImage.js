import toArray from '~/services/toArray';

const readFiles = (files, handler, quill) => {
  files.forEach((file) => {
    console.log('files in forEach!');
    const reader = new FileReader();
    reader.onload = (e) => {
      handler(e.target.result, quill);
    };
    const blob = file.getAsFile ? file.getAsFile() : file;
    if (blob instanceof Blob) reader.readAsDataURL(blob);
  });
};

const ifEverythingInsertedIsImage = (files) =>
  files.every((file) =>
    file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)
  );

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
    const inserts = toArray(e.dataTransfer.files);
    if (ifEverythingInsertedIsImage(inserts)) {
      e.preventDefault();
      readFiles(inserts, this.options.handler, this.quill);
    }
  }

  handlePaste(e) {
    const inserts = toArray(e.clipboardData.items);
    if (ifEverythingInsertedIsImage(inserts)) {
      e.preventDefault();
      readFiles(inserts, this.options.handler, this.quill);
    }
  }
}

export default moduleDropOrPasteImage;
