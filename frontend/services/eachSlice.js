// like Ruby's [].each_slice
// eachSlice([1, 2, 3, 4, 5, 6], 2)

const eachSlice = (array, slicedBy) => {
  let slicedArray = [];
  for (let i = 0; i < array.length; i += slicedBy){
    slicedArray.push(array.slice(i, i + slicedBy))
  }
  return slicedArray
};

export { eachSlice };