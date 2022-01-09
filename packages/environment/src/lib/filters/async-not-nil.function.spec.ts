import { asyncScheduler, scheduled } from 'rxjs';

import { asyncNotNil } from './async-not-nil.function';

describe('asyncNotNil(source, due?)', () => {
  it(`returns resolved Promise with the first non nil value from Observable`, async () => {
    const source = () => scheduled([null, undefined, 0, 1, 2], asyncScheduler);
    await expect(asyncNotNil(source())).resolves.toEqual(0);
  });

  it(`returns resolved Promise with the first non nil value from Promise`, async () => {
    const source = () => Promise.resolve(0);
    await expect(asyncNotNil(source())).resolves.toEqual(0);
  });

  it(`returns resolved Promise with the first non nil value from Array`, async () => {
    const source = [null, undefined, 0, 1, 2];
    await expect(asyncNotNil(source)).resolves.toEqual(0);
  });

  it(`returns resolved Promise if due is setted and emits a value in given time span`, async () => {
    const source = () => scheduled([null, undefined, 0, 1, 2], asyncScheduler);
    await expect(asyncNotNil(source(), 100)).resolves.toEqual(0);
  });

  it(`returns rejected Promise as TimeoutError if due is setted and doesn't emit a value in given time span`, async () => {
    const source = () => scheduled([null, undefined, 0, 1, 2], asyncScheduler);
    await expect(asyncNotNil(source(), 1)).rejects.toThrowError({
      ...new Error(),
      message: 'Timeout has occurred',
      name: 'TimeoutError',
    });
  });

  it(`returns rejected Promise as EmptyError if no elements in sequence`, async () => {
    const source = () => [null, undefined];
    await expect(asyncNotNil(source())).rejects.toThrowError({
      ...new Error(),
      message: 'no elements in sequence',
      name: 'EmptyError',
    });
  });
});
