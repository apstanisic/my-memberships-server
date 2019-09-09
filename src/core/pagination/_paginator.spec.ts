import * as Faker from 'faker';
import { Paginator } from './_paginator';
import { PaginationParams } from './pagination-options';
import { GenerateCursor } from './_generate-cursor';
import {
  PaginatorResponse,
  cursorField,
  orderByField,
} from './pagination.types';

describe('Paginator', () => {
  let paginator: Paginator<any>;
  let mock: jest.Mock;
  let repo;
  beforeEach(() => {
    mock = jest.fn(() => ['some-value']);
    paginator = new Paginator({ find: mock } as any);
  });

  it('executes with passed params', async () => {
    const params = new PaginationParams();
    params.shouldParse = false;
    params.currentUrl = '/hello/world';
    params.cursor = new GenerateCursor(
      {
        id: Faker.random.uuid(),
        createdAt: new Date(),
      },
      'createdAt',
    ).cursor;
    params.relations = ['user'];
    params.limit = 5;
    params.order = 'ASC';
    await paginator.setOptions(params);
    expect(mock.mock.calls.length).toBe(0);
    const result = await paginator.execute();
    expect(mock.mock.calls.length).toBe(1);
    expect(result).toBeInstanceOf(PaginatorResponse);
    expect(result.data).toBe(mock.mock.results[0].value);
  });

  /** @todo This test is invalid */
  it('throws an error with invalid params', async () => {
    paginator = new Paginator({ find: mock } as any);
    const invalid1 = new PaginationParams({ [cursorField]: 'fsaffdsuh8fsad' });
    // const invalid2 = new PaginationParams({ where: '9b0t34jb9t8j340b9' });
    const invalid3 = new PaginationParams({ [orderByField]: 'CESC' });
    // const invalid4 = new PaginationParams({ where: '9b0t34jb9t8j340b9' });

    expect(paginator.setOptions(invalid1)).rejects.toThrow();
    // expect(paginator.setOptions(invalid2)).rejects.toThrow();
    expect(paginator.setOptions(invalid3)).rejects.toThrow();
  });
});
