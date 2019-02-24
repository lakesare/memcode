// a{ courseUserIsLearning: b{ wow_yes: 1 }, amountOfProblems: 3 }
const integerizeColumnsIn = (aOld, asTitlesArray) => {
  const aNew = {};

  Object.keys(aOld).forEach((key) => {
    asTitlesArray.includes(key) ?
      aNew[key] = parseInt(aOld[key], 10) :
      aNew[key] = aOld[key];
  });

  return aNew;
};

// https://github.com/vitaly-t/pg-promise/issues/118
// COUNT(3) => to return js integer instead of string
const integerizeDbColumns = (arrayOrHash, columnTitlesArray) => {
  if (Array.isArray(arrayOrHash)) {
    return arrayOrHash.map(hash =>
      integerizeColumnsIn(hash, columnTitlesArray)
    );
  } else {
    return integerizeColumnsIn(arrayOrHash, columnTitlesArray);
  }
};

export { integerizeDbColumns };
export default integerizeDbColumns;
