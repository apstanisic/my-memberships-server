import * as Faker from 'faker';
import { Validator } from 'class-validator';
import { GenerateCursor } from './_generate-cursor';

describe('Propertly generating pagination cursor', () => {
  const uuid = Faker.random.uuid();
  const validator = new Validator();

  it('Should generate valid base64 cursor', () => {
    const entity = {
      id: uuid,
      createdAt: new Date(),
    };
    const generator = new GenerateCursor(entity, 'createdAt');
    expect(validator.isBase64(generator.cursor)).toBe(true);
    const parsed = Buffer.from(generator.cursor, 'base64').toString('ascii');
    const splited = parsed.split(';');

    expect(splited).toHaveLength(3);
    expect(splited[0]).toBe(entity.id);
    expect(splited[1]).toBe('createdAt');
    expect(Number(splited[2])).toBe(entity.createdAt.getTime());
  });

  it('Should throw if Id not provided', () => {
    const entity = {
      createdAt: new Date(),
      uuid: Faker.random.uuid(),
    };
    expect(() => new GenerateCursor(entity as any, 'createdAt')).toThrow();
    expect(() => new GenerateCursor({ id: undefined } as any)).toThrow();
  });

  it('Should throw if column not provided', () => {
    const entity = { id: Faker.random.uuid() };

    expect(() => {
      const generator = new GenerateCursor(entity, 'createdAt');
    }).toThrow();
  });

  it('Should use string without trying to convert to date', () => {
    const { cursor } = new GenerateCursor({ id: uuid, price: 41 }, 'price');
    expect(validator.isBase64(cursor)).toBe(true);
  });

  it('Should should throw if value undefined', () => {
    expect(
      () => new GenerateCursor({ id: uuid, price: undefined }, 'price'),
    ).toThrow();
  });
});
