// [claude comment] things created offline get negative ids until the server assigns real ones - database ids are always positive, so the two never collide
let lastTempId = 0;

// [claude comment] always below the previous one, so ids generated within the same millisecond (e.g. for several flashcards moved at once) never collide
const generateTempId = () => {
  const tempId = -(Date.now() * 1000 + Math.floor(Math.random() * 1000));
  lastTempId = Math.min(tempId, lastTempId - 1);
  return lastTempId;
};

const isTempId = (id) =>
  id < 0;

const isTempIdString = (string) =>
  /^-\d+$/.test(string);

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;

// [claude comment] idMap is { [tempId]: realId } - returns the same reference when nothing in value changed
const replaceTempIds = (value, idMap) => {
  if (typeof value === 'number') {
    return (value < 0 && idMap[value] !== undefined) ? idMap[value] : value;
  } else if (Array.isArray(value)) {
    let ifChanged = false;
    const replaced = value.map((item) => {
      const replacedItem = replaceTempIds(item, idMap);
      if (replacedItem !== item) ifChanged = true;
      return replacedItem;
    });
    return ifChanged ? replaced : value;
  } else if (isPlainObject(value)) {
    let ifChanged = false;
    const replaced = {};
    Object.entries(value).forEach(([key, item]) => {
      const replacedKey = (isTempIdString(key) && idMap[key] !== undefined) ? String(idMap[key]) : key;
      const replacedItem = replaceTempIds(item, idMap);
      if (replacedKey !== key || replacedItem !== item) ifChanged = true;
      replaced[replacedKey] = replacedItem;
    });
    return ifChanged ? replaced : value;
  } else {
    return value;
  }
};

// [claude comment] '/courses/-1791447462242123/learn' => '/courses/5321/learn'
const replaceTempIdsInString = (string, idMap) =>
  string.replace(/-\d+/g, (match) => (idMap[match] !== undefined ? String(idMap[match]) : match));

export default { generateTempId, isTempId, replaceTempIds, replaceTempIdsInString };
