/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

export function trimSymbols(str, size) {
  if (size === undefined) {
    size = str.length;
  }
  if (size === 0) {return "";}
  let result = '';
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const currentChar = str[i];
    if (i === 0 || str[i] !== str[i - 1]) {
      count = 1;
      result += currentChar;
    } else {
      if (count < size) {
        result += currentChar;
        count++;
      }
    }
  }
    
  return result;
}