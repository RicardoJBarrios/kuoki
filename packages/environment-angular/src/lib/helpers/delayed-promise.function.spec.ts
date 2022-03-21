import { install, InstalledClock } from '@sinonjs/fake-timers';

import { delayedPromise } from './delayed-promise.function';

describe('delayedPromise(value,timeout)', () => {
  let clock: InstalledClock;
  let resolved: jest.Mock<any, any>;

  beforeEach(() => {
    clock = install();
    resolved = jest.fn();
  });

  afterEach(() => {
    clock.uninstall();
    resolved.mockRestore();
  });

  it(`creates a promise on timeout`, async () => {
    delayedPromise('a', 10).then((v) => resolved(v));

    await clock.tickAsync(9);
    expect(resolved).not.toHaveBeenCalled();

    await clock.tickAsync(1);
    expect(resolved).toHaveBeenNthCalledWith(1, 'a');
  });
});
