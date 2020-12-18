import axios from 'axios';

/**
 * HTTP request wrapper for axios
 *
 * @param {String} url              # URL to request
 * @param {Object} options
 *    @param {String} method        # Method used: 'get', 'post', 'delete', etc...
 *    @param {Object} data          # Data passed to request, read from server with req.body
 *    @param {Object} params        # Query passed to request, read from server with req.query
 * @returns {Object}  Returns an object with the response data
 */
export async function invokeAPI(url, { method = 'get', data, params } = {}) {
  const response = await axios({ url, method, data, params });
  return response.data;
}

/**
 * Optional chaining workaround for Vue: https://github.com/vuejs/vue/issues/11088#issuecomment-630287153
 * object?.optionalKey?.optionalKey becomes getSafe(() => object.optionalKey.optionalKey);
 *
 * @param {Function} fn             # Function that returns the value we want to get safe
 * @returns {any}  Returns the value or undefined if could not find the nested keys
 */
export function getSafe(fn) {
  try {
    return fn();
  } catch (err) { /* */ }
  return undefined;
}

/**
 * Returns a readable date in format 'dd MM yyyy at HH:MM:SS'
 *
 * @param {Number} timestamp        # Timestamp to parse
 * @returns {String}  Returns the string with the readable date
 */
export function formatReadableDate(timestamp) {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [
    year = date.getFullYear(),
    month = date.getMonth(),
    day = date.getDate().toString().padStart(2, '0'),
    hour = date.getHours().toString().padStart(2, '0'),
    minutes = date.getMinutes().toString().padStart(2, '0'),
    seconds = date.getSeconds().toString().padStart(2, '0'),
  ] = [];
  return `${day} ${months[month]} ${year} at ${hour}:${minutes}:${seconds}`;
}

export default { invokeAPI, getSafe };
