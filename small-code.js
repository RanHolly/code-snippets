/**
 * Get the current time in hh:mm:ss format.
 * @returns {string} The time in hh:mm:ss format.
 */
function getCurrentTime() {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${hour}:${minute}:${second}`;
}

/**
 * This function returns a detailed time with milliseconds (hh:mm:ss:ms).
 * @returns Time fromat: hh:mm:ss:ms.
 */
function getDetaliedTime() {
  const date = new Date();
  const millisecond = date.getMilliseconds().toString().padStart(3, '0');
  return `${getCurrentTime()}:${millisecond}`;
}

/**
 * Get the current date in the dd.mm.yyyy format.
 * @returns The data in dd.mm.yyyy format.
 */
function getCurrentDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}.${month}.${year}`;
}

/**
 * Get the current date and time in [dd.mm.yyyy][hh:mm:ss] format.
 * @returns {string} The date and time in [dd.mm.yyyy][hh:mm:ss] format.
 */
function getDateAndTime() {
  const currentDate = getCurrentDate();
  const currentTime = getCurrentTime();
  return `[${currentDate}][${currentTime}]`;
}

/**
 * Removes all trailing newline characters from the given text.
 * @param {string} text - The input text to be formatted.
 * @returns {string} The formatted text with trailing newline characters removed.
 */
function removeTrailingNewlines(text) {
  const newlinePattern = /\r?\n$/;
  const inputText = text.toString();
  let result = inputText;

  if (inputText.endsWith('\n') || newlinePattern.test(inputText)) {
    result = inputText.slice(0, -1);
  }

  return result;
}
