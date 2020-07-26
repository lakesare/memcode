const standardToolbarContainer = [
  ['bold', { script: 'sub' }, { script: 'super' }, 'code'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  ['link', 'image'],
  // [{ 'size': ['small', false, 'large', 'huge'] }],
  // [{ 'color': [] }, { 'background': [] }],

  ['clean'],
  // katex support, imported using cdn
  ['formula']
];

export default standardToolbarContainer;
