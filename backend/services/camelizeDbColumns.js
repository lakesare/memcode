import pkg from 'pg-promise';
const { utils } = pkg;

const camelizeHashKeys = (oldHash) => {
  const newHash = {};
  if (oldHash === undefined || oldHash === null) return null;
  Object.keys(oldHash).forEach((key) => {
    const camelizedKey = utils.camelize(key);
    newHash[camelizedKey] = oldHash[key];
  });
  return newHash;
};

// a{ courseUserIsLearning: b{ wow_yes: 1 }, amountOfProblems: 3 }
const camelizeColumnsIn = (aOld, asTitlesArray) => {
  const aNew = {};

  Object.keys(aOld).forEach((key) => {
    asTitlesArray.includes(key) ?
      aNew[key] = camelizeHashKeys(aOld[key]) :
      aNew[key] = aOld[key];
  });

  return aNew;
};

// output of row_to_json doesn't get camelized, lets do it manually like so:
// .then(array => camelizeDbColumns(array, ['course', 'courseUserIsLearning']))
// http://stackoverflow.com/questions/33023469/node-postgres-and-getting-joined-fields-with-repeated-names
const camelizeDbColumns = (arrayOrHash, columnTitlesArray) => {
  if (Array.isArray(arrayOrHash)) {
    return arrayOrHash.map(hash =>
      camelizeColumnsIn(hash, columnTitlesArray)
    );
  } else {
    return camelizeColumnsIn(arrayOrHash, columnTitlesArray);
  }
};

export { camelizeDbColumns };
