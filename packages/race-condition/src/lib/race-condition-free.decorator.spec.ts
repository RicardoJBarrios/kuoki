import { install, InstalledClock } from '@sinonjs/fake-timers';
import { interval, map, Subscription, take } from 'rxjs';

import { RaceConditionFree } from './race-condition-free.decorator';

const load10 = jest.fn();
const load5 = jest.fn();

class TestClass {
  @RaceConditionFree()
  method10(value: string): Subscription {
    return interval(10)
      .pipe(
        map(() => value),
        take(2)
      )
      .subscribe((v) => load10(v));
  }

  @RaceConditionFree()
  method5(value: string): Subscription {
    return interval(5)
      .pipe(
        map(() => value),
        take(2)
      )
      .subscribe((v) => load5(v));
  }
}

describe('@RaceConditionFree', () => {
  let clock: InstalledClock;
  let testClass: TestClass;

  beforeEach(() => {
    clock = install();
    testClass = new TestClass();
  });

  afterEach(() => {
    clock.uninstall();
    load10.mockRestore();
  });

  it(`uses RaceConditionFreeSubscription`, () => {
    testClass.method10('a');
    expect(load10).not.toHaveBeenCalled();

    clock.tick(10);
    expect(load10).toHaveBeenNthCalledWith(1, 'a');
    testClass.method10('b');

    clock.tick(10);
    expect(load10).toHaveBeenNthCalledWith(2, 'b');

    clock.runAll();
    expect(load10).toHaveBeenCalledTimes(3);
  });

  it(`uses independent RaceConditionFreeSubscription`, () => {
    testClass.method10('a');
    testClass.method5('a');

    clock.tick(10);
    testClass.method10('b');

    clock.runAll();
    expect(load10).toHaveBeenCalledTimes(3);
    expect(load5).toHaveBeenCalledTimes(2);
  });

  it(`workds with multiple instances`, () => {
    const testClass2 = new TestClass();
    testClass.method10('a');
    testClass2.method10('a');

    clock.tick(10);
    testClass.method10('b');

    clock.runAll();
    expect(load10).toHaveBeenCalledTimes(5);
  });
});
