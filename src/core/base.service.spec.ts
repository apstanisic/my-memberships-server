import { Equal } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { BaseService } from './base.service';
import { PaginationParams } from './pagination/pagination-options';
import { PaginatorResponse } from './pagination/pagination.types';
import { paginate } from './pagination/_paginate.helper';

// Supres NestJs console logs
Logger.overrideLogger(true);

const exampleEntity = { id: 'qwerty', name: 'some name' };

const find = jest.fn();
const findOne = jest.fn();
const findByIds = jest.fn();
const create = jest.fn();
const save = jest.fn();
const merge = jest.fn();
const remove = jest.fn();
const count = jest.fn();
const paginateMock = jest.fn();

jest.mock('./pagination/_paginate.helper', () => {
  // Returns provided option.
  const mock = jest.fn(({ options }: any): any => options);
  return {
    __esModule: true,
    paginate: mock,
  };
});

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
class Service extends BaseService<any> {
  public async convertToEntity(value: any): Promise<any> {
    return super.convertToEntity(value);
  }
}

/** Base service */
describe('BaseService', () => {
  let service: Service;

  /** Before each test */
  beforeEach(() => {
    service = new Service(repoMock() as any);
    jest.clearAllMocks();
    // Reset return value after each test
    find.mockResolvedValue([exampleEntity]);
    findOne.mockResolvedValue(exampleEntity);
    create.mockReturnValue(exampleEntity);
    findByIds.mockResolvedValue([exampleEntity]);
    save.mockResolvedValue(exampleEntity);
    merge.mockReturnValue(exampleEntity);
    remove.mockResolvedValue(exampleEntity);
    count.mockResolvedValue(3);
  });

  /** Testing service.findOne */
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

    it('throws if entity not found', async () => {
      findOne.mockResolvedValue(Promise.resolve(undefined));
      const res = service.findOne('id');
      await expect(res).rejects.toThrow(NotFoundException);
      expect(findOne).toBeCalledTimes(1);
    });

    it('throws if entity not found', async () => {
      findOne.mockRejectedValue(new Error('findOne'));
      const res = service.findOne('id');
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(findOne).toBeCalledTimes(1);
    });
  });

  /** Test service.findByIds */
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
      findByIds.mockRejectedValue(new Error('findByIds'));
      const res = service.findByIds([1, 2, 3, 4]);
      await expect(res).rejects.toThrow(InternalServerErrorException);
    });
  });

  /** Testing service.find */
  describe('find', () => {
    it('returns found results', async () => {
      const res = service.find({ some: 'value' });
      await expect(res).resolves.toEqual([exampleEntity]);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({ where: { some: Equal('value') } });
    });

    it('returns all if filter not provided', async () => {
      const res = service.find();
      await expect(res).resolves.toEqual([exampleEntity]);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({ where: {} });
    });

    it('throws if repo throws', async () => {
      find.mockRejectedValue(new Error('find'));
      const res = service.find({ some: 'value' });
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(find).toBeCalledTimes(1);
      expect(find).toBeCalledWith({ where: { some: Equal('value') } });
    });
  });

  /** Testing service.count */
  describe('count', () => {
    it('counts results', async () => {
      const res = service.count({ some: 'value' });
      await expect(res).resolves.toEqual(3);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({ where: { some: Equal('value') } });
    });

    it('passes second param to repo', async () => {
      const res = service.count(
        { some: 'value' },
        { relations: ['user'], take: 10 },
      );
      await expect(res).resolves.toEqual(3);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({
        where: { some: Equal('value') },
        relations: ['user'],
        take: 10,
      });
    });

    it('throws if repo throws', async () => {
      count.mockRejectedValue(new Error('count'));
      const res = service.count({ some: 'value' });
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(count).toBeCalledTimes(1);
      expect(count).toBeCalledWith({ where: { some: Equal('value') } });
    });
  });

  /**
   * Testing service.convertToEntity
   * This is protected method
   */
  describe('convertToEntity', () => {
    it('returns same entity instance if value entity', async () => {
      const res = service.convertToEntity(exampleEntity);
      await expect(res).resolves.toBe(exampleEntity);
      await expect(findOne).not.toHaveBeenCalled();
    });

    it('converts string to entity', async () => {
      const res = service.convertToEntity('value');
      await expect(res).resolves.toBe(exampleEntity);
      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith('value');
    });

    it('converts string to entity', async () => {
      const res = service.convertToEntity('value');
      await expect(res).resolves.toBe(exampleEntity);
      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith('value');
    });

    it('passes thrown error upstairs', async () => {
      findOne.mockRejectedValue(new Error('convertToEntity'));
      const res = service.convertToEntity('value');
      await expect(res).rejects.toThrow(Error);
      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith('value');
    });
  });

  /** Testing service.delete */
  describe('delete', () => {
    it('deletes an entity with id', async () => {
      const res = service.delete('some-id');
      await expect(res).resolves.toEqual(exampleEntity);
      expect(remove).toBeCalledTimes(1);
      expect(remove).toReturnWith(Promise.resolve(exampleEntity));
    });

    it('deletes an entity', async () => {
      const res = service.delete(exampleEntity);
      await expect(res).resolves.toEqual(exampleEntity);
      expect(remove).toBeCalledTimes(1);
      expect(remove).toReturnWith(Promise.resolve(exampleEntity));
    });

    it('throws if convertToEntity throws', async () => {
      findOne.mockRejectedValue(new Error('delete convert throws'));
      // remove.mockResolvedValue(exampleEntity);
      const res = service.delete('entity-id');
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(findOne).toBeCalledTimes(1);
      expect(remove).not.toBeCalled();
    });

    it('throws if remove throws', async () => {
      // findOne.mockResolvedValueOnce(exampleEntity);
      remove.mockRejectedValue(new Error('delete remove throws'));
      const res = service.delete('entity-id');
      await expect(res).rejects.toThrow(InternalServerErrorException);
      expect(findOne).toBeCalledTimes(1);
      expect(remove).toBeCalledTimes(1);
    });

    it('soft delete entity', async () => {
      const softDelete = { ...exampleEntity, deleted: {} };
      const user = { id: 'any' };
      const res = service.delete(softDelete, user as any);
      await expect(res).resolves.toMatchObject(exampleEntity);
      expect(findOne).not.toBeCalled();
      expect(remove).not.toBeCalled();
    });
  });

  /** Testing service.update */
  describe('update', () => {
    it('updates the user with id', async () => {
      const res = service.update('entity-id', { id: 'test' });
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).toBeCalledTimes(1);
      expect(merge).toBeCalledTimes(1);
      expect(merge).toBeCalledWith(exampleEntity, { id: 'test' });
      expect(save).toBeCalledTimes(1);
    });

    it('updates the user', async () => {
      const res = service.update(exampleEntity, { id: 'test' });
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).not.toBeCalled();
      expect(merge).toBeCalledTimes(1);
      expect(merge).toBeCalledWith(exampleEntity, { id: 'test' });
      expect(save).toBeCalledTimes(1);
    });

    it('updates the user without new data', async () => {
      const res = service.update(exampleEntity);
      await expect(res).resolves.toEqual(exampleEntity);
      expect(findOne).not.toBeCalled();
      expect(merge).toBeCalledTimes(1);
      expect(merge).toBeCalledWith(exampleEntity, {});
      expect(save).toBeCalledTimes(1);
    });

    it('throws if repo throws', async () => {
      save.mockRejectedValue(new Error('update repo throws'));
      const res = service.update(exampleEntity);
      await expect(res).rejects.toThrow(BadRequestException);
      expect(merge).toBeCalledWith(exampleEntity, {});
    });

    it('throws if repo.merge throws', async () => {
      merge.mockImplementation(() => {
        throw new Error('update merge throws');
      });
      const res = service.update(exampleEntity);
      await expect(res).rejects.toThrow(BadRequestException);
      expect(merge).toBeCalledWith(exampleEntity, {});
    });
  });

  /** Testing service.updateWhere */
  describe('updateWhere', () => {
    it('updates entity with conditions', async () => {
      service.findOne = jest.fn().mockResolvedValue(exampleEntity);
      service.update = jest.fn().mockResolvedValue(exampleEntity);

      const filter = { id: '34' };

      const res = service.updateWhere(filter as any, exampleEntity);
      await expect(res).resolves.toEqual(exampleEntity);
      expect(service.findOne).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledWith(filter);
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith(exampleEntity, exampleEntity);
    });
  });

  /** Testing service.updateWhere */
  describe('deleteWhere', () => {
    it('delete entity with conditions', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce(exampleEntity);
      service.delete = jest.fn().mockResolvedValueOnce(exampleEntity);

      const filter = { id: '34' };

      const res = service.deleteWhere(filter as any);
      await expect(res).resolves.toEqual(exampleEntity);
      expect(service.findOne).toBeCalledTimes(1);
      expect(service.findOne).toBeCalledWith(filter);
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(exampleEntity);
    });
  });

  describe('create', () => {
    it('creates entity in db', async () => {
      const res = service.create(exampleEntity);
      await expect(res).resolves.toEqual(exampleEntity);
    });

    it('throws if repo throws', async () => {
      save.mockRejectedValue(new Error('create throw'));
      const res = service.create(exampleEntity);
      await expect(res).rejects.toThrow(BadRequestException);
    });
  });

  /** Testing service.paginate
   * paginate mock always retuns options param
   */
  describe('paginate', () => {
    let params: PaginationParams;

    beforeEach(() => {
      params = new PaginationParams();
      params.relations = ['test'];
      params.currentUrl = 'hello-world';
    });

    it('passes data to paginate', async () => {
      const res = service.paginate(params);
      await expect(res).resolves.toEqual({ ...params, where: {} });
    });

    it('combines params and where', async () => {
      params.where = { id: 7 };
      const res = service.paginate(params, { hello: 'world' });
      await expect(res).resolves.toEqual({
        ...params,
        where: { id: Equal(7), hello: Equal('world') },
      });
    });
  });
});
