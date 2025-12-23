/* eslint-disable @typescript-eslint/ban-types */

/**
 * Check if a value is empty.
 *
 * @param value The value to check.
 * @returns Returns `true` if the value is empty, else `false`.
 *
 * @example
 *
 * isEmpty(null); // => true
 * isEmpty(undefined); // => true
 * isEmpty(''); // => true
 * isEmpty([]); // => true
 * isEmpty({}); // => true
 * isEmpty(' '); // => false
 * isEmpty([1]); // => false
 * isEmpty({ a: 1 }); // => false
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string' && value.length === 0) {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  if (typeof value === 'object' && Object.keys(value).length === 0 && value.constructor === Object) {
    return true
  }

  return false
}
