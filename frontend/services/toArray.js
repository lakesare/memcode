// @params arrayLikeObject - FileList
const toArray = (arrayLikeObject) =>
  [].slice.call(arrayLikeObject);

export default toArray;
