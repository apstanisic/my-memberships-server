import * as Faker from 'faker';
import { Validator } from 'class-validator';
import { GenerateCursor } from './_generate-cursor';

describe('Propertly generating pagination cursor', () => {
  const validator = new Validator();
  it('Should generate valid base64 cursor', () => {
    const uuid = Faker.random.uuid();
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
    expect(() => {
      const generator = new GenerateCursor(entity as any, 'createdAt');
    }).toThrow();
  });

  it('Should throw if column not provided', () => {
    const entity = { id: Faker.random.uuid() };

    expect(() => {
      const generator = new GenerateCursor(entity, 'createdAt');
    }).toThrow();
  });
});
