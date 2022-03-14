import { isClass } from './is-class';

abstract class AbstractTestClass {}
class TestsClass {}
const test = new TestsClass();
function TestFunction() {}

describe('isType(value)', () => {
  it(`returns true if value is custom class`, () => {
    expect(isClass(TestsClass)).toBeTrue();
  });

  it(`returns true if value is abstract type`, () => {
    expect(isClass(AbstractTestClass)).toBeTrue();
  });

  it(`returns false if value is nil`, () => {
    expect(isClass(null)).toBeFalse();
    expect(isClass(undefined)).toBeFalse();
  });

  it(`returns false if value is instance`, () => {
    expect(isClass(test)).toBeFalse();
  });

  it(`returns false if value is named function`, () => {
    expect(isClass(TestFunction)).toBeFalse();
  });

  it(`returns false if value is anonymous function`, () => {
    expect(isClass(() => null)).toBeFalse();
  });

  it(`returns false if value is plain object`, () => {
    expect(isClass({ a: 0 })).toBeFalse();
  });
});
