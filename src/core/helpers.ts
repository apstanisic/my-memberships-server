/**
 * Check if property exist on objectj
 * @warning Don't use hasOwn property. Use has.call(obj, property)
 */
export const has = Object.prototype.hasOwnProperty;

/**
 * Removes properties that are null, undefined or empty string
 * @example
 * const from = { a: 'Hello', b: '', c: null, d: undefined };
 * const to = { a: 'Hello' };
 */
export function removeEmptyItems(obj: Record<string, any>) {
  const validItems: any = {};

  Object.keys(obj).forEach((key: string) => {
    if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
      validItems[key] = obj[key];
    }
  });

  return validItems;
}

/** Make pause for provided miliseconds */
export function wait(time: number) {
  return new Promise((res, rej) => {
    try {
      setTimeout(res, time);
    } catch (error) {
      rej();
    }
  });
}

/**
 * Check if string is bcrypt hash. There can be passed any
 * value. Maybe it is null or undefined. Funcion will then return false
 */
export function isBcryptHash(text: string | any) {
  if (typeof text !== 'string') return false;
  return text.startsWith('$2a$');
}

/**
 * Convert string, null or undefined to object
 * It will convert JSON string to object literal.
 * For nullable values will return empty object.
 * Always returns new object
 */
export function convertToObject<T = any>(
  query: Record<string, T> | string | null | undefined,
): Record<string, T> {
  if (query === null || query === undefined) return {};
  if (typeof query === 'string') return JSON.parse(query);
  return { ...query };
}

/**
 * Accepts array or any other type.
 * If not array, make it a single item array.
 * Othervise return array,
 * Lodash have this method
 * @deprecated Use lodash built in method
 */
export function castArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  }
  return [item];
}

/**
 * Disables certain key in object
 * For example, object can't have field that contains password
 * Eg. 'password', 'password_lt', 'awesomepasswordfield'
 */
export function hasForbiddenKey(
  obj: Record<string, any>,
  key: string,
): boolean {
  return Object.keys(obj).every((objectKey) => objectKey.toLowerCase().includes(key.toLowerCase()));
}
