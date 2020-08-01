// (['a', 'b', 'c', 'd', 'e'], 1, 3) // => ['a', 'c', 'd', _'b'_, 'e']
// (['a', 'b', 'c', 'd', 'e'], 3, 0) // => [ 'd', 'a', 'b', 'c', 'e' ]
const injectFromOldToNewIndex = (array, oldIndex, newIndex, { direction }) => {
  // Direction:
  // Old index was 12 (In reality 0)
  // New index was 0 (In reality 12)
  console.log({ oldIndex, newIndex, direction });
  // If direction is reversed!
  if (direction) {
    // oldIndex = array.length - 1 - oldIndex;
    // newIndex = array.length - 1 - newIndex;
  }

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
