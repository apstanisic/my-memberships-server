/* Don't use hasOwn property. Use has.call(obj, property) */
export const has = Object.prototype.hasOwnProperty;

/**
 * Removes properties that are null, undefined or empty string
 * from: { a: 'Hello', b: '', c: null, d: undefined }
 * to: { a: 'Hello' }
 */
export function removeEmptyItems(obj: Record<string, any>) {
  const validItems: any = {};

  for (const key in obj) {
    if (has.call(obj, key)) {
      if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
        validItems[key] = obj[key];
      }
    }
  }

  return validItems;
}

/* Make pause, for example to pass b2 to busy limit */
export function wait(time: number) {
  return new Promise((res, rej) => {
    try {
      setTimeout(res, time);
    } catch (error) {
      rej();
    }
  });
}

/* Check if string is bcrypt hash */
export function isBcryptHash(text: string) {
  return text.startsWith('$2a$');
}

/* Convert string, null or undefined to object */
export function convertToObject<T = any>(
  query: Record<string, T> | string | null | undefined
): Record<string, T> {
  if (query === null || query === undefined) return {};
  if (typeof query === 'string') return JSON.parse(query);
  return { ...query };
}

export function toArray<T>(item: T | T[]): T[] {
  if (Array.isArray(item)) {
    return item;
  } else {
    return [item];
  }
}
