import { Stream } from 'stream';

const removeMock = jest.fn();
removeMock
  .mockImplementationOnce((...params) => {
    console.log('mock called');

    params[2](null);
  })
  .mockImplementationOnce((...params) => params[2]('some-non-null-value'))
  .mockImplementation((...params) => params[2](null));

export const Client = jest.fn(() => ({
  putObject(...params: any[]) {
    const cb = params[params.length - 1] as (e?: any) => void;
  },

  listObjectsV2(bucket: string, prefix: string) {
    const stream = new Stream();
    Array(5).forEach(i => {
      stream.emit('data', 'file-name');
    });
    stream.emit('end');
  },

  removeObject: removeMock,

  removeObjects: removeMock,
}));

export default {
  Client,
};
