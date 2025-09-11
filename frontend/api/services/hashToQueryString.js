// @param hash - { SearchQuery: '', pageSize: '', passengerId: 15 }
// => SearchQuery=Hello&pageSize=3
const hashToQueryString = (hash) => {
  if (!hash || typeof hash !== 'object') {
    return '';
  }
  return Object.keys(hash).map((key) =>
    key + '=' + encodeURIComponent(hash[key])
  ).join('&');
};

export default hashToQueryString;
