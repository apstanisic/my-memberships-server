import { Equal } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BaseService } from './base.service';

// Supres NestJs console logs
Logger.overrideLogger(true);

const exampleEntity = { id: 'qwerty', name: 'some name' };

const find = jest.fn().mockReturnValue([exampleEntity]);
const findOne = jest.fn().mockResolvedValue(exampleEntity);
const findByIds = jest.fn().mockResolvedValue([exampleEntity]);
const create = jest.fn().mockResolvedValue(exampleEntity);
const save = jest.fn().mockResolvedValue(exampleEntity);
const merge = jest.fn().mockResolvedValue(exampleEntity);
const remove = jest.fn().mockResolvedValue(exampleEntity);
const count = jest.fn().mockReturnValue(3);

const repoMock = jest.fn(() => ({
  find,
  findOne,
  findByIds,
  create,
  save,
  merge,
  remove,
  count,
}));
// Base service is abstract class
class Service extends BaseService {}
describe('Base Service', () => {
  let service: BaseService;

  beforeEach(() => {
    service = new Service(repoMock() as any);
    findOne.mockClear();
    findByIds.mockClear();
    find.mockClear();
    count.mockClear();
  });

  describe('findOne', () => {
    it('successfully finds entity with id', async () => {
      const res = service.findOne('querty');
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith({ where: { id: Equal('querty') } });
    });

    it('successfully finds entity with filter', async () => {
      const res = service.findOne({ id: 5 });
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith({ where: { id: Equal(5) } });
    });

    it('successfully finds entity without parsed query', async () => {
      const res = service.findOne({ id: 'some-id' }, {}, false);
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith({ where: { id: 'some-id' } });
    });

    it('successfully finds entity without parsed id', async () => {
      const res = service.findOne('some-id', {}, false);
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).toBeCalledTimes(1);
      expect(findOne).toBeCalledWith({ where: { id: 'some-id' } });
    });

    it('throws if entity not found', async () => {
      findOne.mockResolvedValue(Promise.resolve(undefined));
      const res = service.findOne('id');
      await expect(res).rejects.toThrow(NotFoundException);
      expect(findOne).toBeCalledTimes(1);
    });

    it('throws if entity not found', async () => {
      findOne.mockRejectedValue(new Error('Test Error'));
      const res = service.findOne('id');
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(findOne).toBeCalledTimes(1);
    });
  });

  // Find by Ids
  describe('findByIds', () => {
    it('returns find value', async () => {
      findByIds.mockResolvedValue(Promise.resolve(['value1', 'value2']));
      const res = service.findByIds(['v1', 'x2', 'a3', '4fas']);
      await expect(res).resolves.toEqual(['value1', 'value2']);
    });

    it('returns if empty array', async () => {
      findByIds.mockResolvedValue(Promise.resolve([]));
      const res = service.findByIds([1, 2, 3, 4]);
      await expect(res).resolves.toEqual([]);
    });

    it('throws if repo throw', async () => {
      findByIds.mockRejectedValue(new Error('findByIds error'));
      const res = service.findByIds([1, 2, 3, 4]);
      await expect(res).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('find', () => {
    it('returns found results', async () => {
      const res = service.find({ some: 'value' });
      await expect(res).resolves.toEqual([exampleEntity]);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({ where: { some: Equal('value') } });
    });

    it('returns found results without parse', async () => {
      const res = service.find({ some: 'value' }, false);
      await expect(res).resolves.toEqual([exampleEntity]);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({ where: { some: 'value' } });
    });

    it('throws if repo throws', async () => {
      find.mockRejectedValue(new Error('test error'));
      const res = service.find({ some: 'value' });
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({ where: { some: Equal('value') } });
    });
  });

  describe('count', () => {
    it('counts results', async () => {
      const res = service.count({ some: 'value' });
      await expect(res).resolves.toEqual(3);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({ where: { some: Equal('value') } });
    });

    it('counts results without parsing', async () => {
      const res = service.count({ some: 'value' }, {}, false);
      await expect(res).resolves.toEqual(3);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({ where: { some: 'value' } });
    });

    it('passes second param to repo', async () => {
      const res = service.count(
        { some: 'value' },
        { relations: ['user'], take: 10 },
        false,
      );
      await expect(res).resolves.toEqual(3);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({
        where: { some: 'value' },
        relations: ['user'],
        take: 10,
      });
    });

    it('throws if repo throws', async () => {
      count.mockRejectedValue(new Error('test error'));
      const res = service.count({ some: 'value' });
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({ where: { some: Equal('value') } });
    });
  });
});
