import { ValidEmail } from './validate-email.pipe';

describe('Test ValidEmail pipe', () => {
  it('Should should see if value is valid email', () => {
    const email = 'testing@exampe.com';
    const pipe = new ValidEmail();
    expect(() => pipe.transform()).toThrow();
    expect(() => pipe.transform(undefined)).toThrow();
    expect(() => pipe.transform(null)).toThrow();
    expect(() => pipe.transform(5)).toThrow();
    expect(() => pipe.transform('string')).toThrow();
    expect(() => pipe.transform('string@')).toThrow();
    expect(() => pipe.transform('string@ofjsd')).toThrow();
    expect(() => pipe.transform({ object: 'val' })).toThrow();
    expect(() => pipe.transform({ object: email })).toThrow();
    expect(() => pipe.transform({ uuid: email })).toThrow();
    expect(() => pipe.transform(['key'])).toThrow();
    expect(() => pipe.transform([email])).toThrow();
    expect(pipe.transform(email)).toBe(email);
  });
});
