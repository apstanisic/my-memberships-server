import { ValidUUID } from './uuid.pipe';

describe('Test UUID pipe', () => {
  const uuid = '6809500c-d21a-11e9-bb65-2a2ae2dbcce4';
  let pipe: ValidUUID;

  beforeEach(() => {
    pipe = new ValidUUID();
  });

  it('throws on invalid values', () => {
    expect(() => pipe.transform()).toThrow();
    expect(() => pipe.transform(undefined)).toThrow();
    expect(() => pipe.transform(null)).toThrow();
    expect(() => pipe.transform(5)).toThrow();
    expect(() => pipe.transform('string')).toThrow();
    expect(() => pipe.transform({ object: 'val' })).toThrow();
    expect(() => pipe.transform({ object: uuid })).toThrow();
    expect(() => pipe.transform({ uuid })).toThrow();
    expect(() => pipe.transform(['key'])).toThrow();
    expect(() => pipe.transform([uuid])).toThrow();
  });

  it('returns uuid on valid value', () => {
    expect(pipe.transform(uuid)).toBe(uuid);
  });
});
