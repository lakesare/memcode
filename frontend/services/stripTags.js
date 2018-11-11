import striptags from 'striptags';

// ___Why not strip 'p'?
//    For newlines and spaces to be kept.
// ___Why not keep 'br's too?
//    ['p'] is used instead of ['br'] because our text editor just inclides p's for newlines
// ___How to css it?
//    Just don't forget to `margin: 0` for 'p's.
const stripTags = (html) =>
  striptags(html, ['p'], '');

export { stripTags };
