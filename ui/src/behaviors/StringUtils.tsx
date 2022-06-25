/**
 * Changes first character of a given string to uppercase.
 * 
 * @param inputStr String to change the first character to uppercase.
 * @returns Modified string. Example, if 'test' is the input string then the return would be 'Test'.
 */
export function firstLetterUpperCase(inputStr: string) {
  return inputStr ? (inputStr[0].toUpperCase() + inputStr.substring(1)) : "";
}
