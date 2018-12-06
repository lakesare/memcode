// (['a', 'b', 'c', 'd', 'e'], 1, 3) // => ['a', 'c', 'd', _'b'_, 'e']
// (['a', 'b', 'c', 'd', 'e'], 3, 0) // => [ 'd', 'a', 'b', 'c', 'e' ]
const injectFromOldToNewIndex = (array, oldIndex, newIndex) => {
  let newArray = array.filter((x, index) => index !== oldIndex);
  const movedElement = array[oldIndex];

  newArray = [
    ...newArray.slice(0, newIndex),
    movedElement,
    ...newArray.slice(newIndex, array.length)
  ];
  return newArray;
};

export default injectFromOldToNewIndex;
