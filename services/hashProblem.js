// [claude comment] keys are sorted, so the same flashcard hashes the same in the browser and on the server whatever order its keys were stored in
const toCanonicalJson = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map(toCanonicalJson).join(',')}]`;
  } else if (value && typeof value === 'object') {
    const keys = Object.keys(value).filter((key) => value[key] !== undefined).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${toCanonicalJson(value[key])}`).join(',')}}`;
  } else if (typeof value === 'string') {
    // [claude comment] image srcs are left out - an image pasted offline is saved as a data: url, which gets swapped for its S3 url when the flashcard reaches the server; '&amp;' and '&' are the same text, and imported flashcards hold bare '&'s until an editor rewrites them
    return JSON.stringify(value.replace(/(<img\b[^>]*?)\s+src="[^"]*"/g, '$1').replace(/&amp;/g, '&'));
  } else {
    return JSON.stringify(value === undefined ? null : value);
  }
};

// [claude comment] FNV-1a
const hashString = (string) => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < string.length; i++) {
    hash ^= string.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16);
};

const hashProblem = ({ type, content }) =>
  hashString(toCanonicalJson({ type, content }));

export { hashString };
export default hashProblem;
