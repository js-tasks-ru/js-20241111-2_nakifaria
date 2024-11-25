/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  const invertedObj = {};
  if (obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        invertedObj[obj[key]] = key;
      }
    }
    return invertedObj;
  }
  return undefined;
}