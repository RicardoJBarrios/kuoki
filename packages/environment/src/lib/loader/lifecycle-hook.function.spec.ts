import { lifecycleHook } from './lifecycle-hook.function';

class TestClass {
  method(a: number): number {
    return a;
  }
}

describe('lifecycleHook(obj, method, ...args)', () => {
  let testClass: TestClass;

  beforeEach(() => {
    testClass = new TestClass();
  });

  it(`returns The method's return value if exists`, () => {
    expect(lifecycleHook(testClass, 'method', 1)).toEqual(1);
  });

  it(`returns undefined if the method doesn't exist`, () => {
    expect(lifecycleHook(testClass, 'noMethod', 1)).toBeUndefined();
  });
});
