/* Don't use hasOwn property. Use has.call(obj, property) */
export const has = Object.prototype.hasOwnProperty;

/* Removes properties that are null, undefined or empty string */
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

export function isBcryptHash(text: string) {
  return text.startsWith('$2a$');
}
