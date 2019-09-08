import {
  removeEmptyItems,
  convertToObject,
  castArray,
  hasForbiddenKey,
  wait,
} from './helpers';

// For testing wait
jest.useFakeTimers();

describe('Testing helpers', () => {
  // removeEmptyItems
  it('Should remove empty items from object', () => {
    const obj = {
      a: 'Hello World',
      b: null,
      c: undefined,
      d: '',
    };
    expect(removeEmptyItems(obj)).toEqual({ a: 'Hello World' });
  });

  // wait
  it('Should wait spacified time', () => {
    const startTime = new Date().getTime();
    wait(200).then(() => {
      expect(new Date().getTime() - 200).toBe(startTime);
      expect(new Date().getTime() - 201).toBeLessThan(startTime);
      expect(new Date().getTime() - 199).toBeGreaterThan(startTime);
    });
  });

  // convertToObject
  it('Should convert any to object', () => {
    expect(convertToObject(null)).toEqual({});
    expect(convertToObject(undefined)).toEqual({});
    expect(convertToObject('fdsa9')).toEqual({});
    expect(convertToObject('[1,2,3,4]')).toEqual({});
    expect(convertToObject('{"a":5}')).toEqual({ a: 5 });
    expect(convertToObject({ a: 5 })).toEqual({ a: 5 });
  });

  // castArray
  it('Should cast value to array', () => {
    expect(castArray(1)).toEqual([1]);
    expect(castArray('str')).toEqual(['str']);
    expect(castArray({ prop: 2 })).toEqual([{ prop: 2 }]);
    expect(castArray([1, 2])).toEqual([1, 2]);
  });

  // hasForbiddenKey
  it('Should disallow forbidden key', () => {
    const key = 'key';

    expect(hasForbiddenKey({ some: 'value' }, key)).toEqual(false);
    expect(hasForbiddenKey({ some: key }, key)).toEqual(false);
    expect(hasForbiddenKey({ some: { key } }, key)).toEqual(false);
    expect(hasForbiddenKey({ some: 'value', [key]: 'value' }, key)).toEqual(
      true,
    );
    expect(
      hasForbiddenKey(
        { some: 'value', [key]: 'value', [`${key}_ext`]: 123 },
        key,
      ),
    ).toEqual(true);
  });
});
