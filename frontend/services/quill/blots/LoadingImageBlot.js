import Quill from 'quill';

const { EmbedBlot } = Quill.import('parchment');

// [claude comment] an inline embed like quill's own image blot, so the placeholder sits inside the same <p> the uploaded image ends up in and the editor keeps the same height when the upload finishes
class LoadingImageBlot extends EmbedBlot {
  static blotName = 'loadingImage';
  static tagName = 'span';
  static className = 'placeholder-for-loading-image';

  static create({ src, id }) {
    const node = super.create();
    node.setAttribute('data-id', id);

    const img = document.createElement('img');
    img.setAttribute('src', src);
    node.appendChild(img);

    return node;
  }

  // That's for reinitialising it from html (from backend) -> into Quill again
  static value(node) {
    return {
      src: node.querySelector('img').getAttribute('src'),
      id: node.getAttribute('data-id')
    };
  }
}

export default LoadingImageBlot;
