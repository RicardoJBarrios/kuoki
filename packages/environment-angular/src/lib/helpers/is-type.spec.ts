import { isType } from './is-type';

abstract class AbstractTestClass {}
class TestsClass {}
const test = new TestsClass();
function TestFunction() {}

describe('isType(value)', () => {
  it(`returns true if value is custom class`, () => {
    expect(isType(TestsClass)).toBeTrue();
  });

  it(`returns true if value is abstract type`, () => {
    expect(isType(AbstractTestClass)).toBeTrue();
  });

  it(`returns false if value is nil`, () => {
    expect(isType(null)).toBeFalse();
    expect(isType(undefined)).toBeFalse();
  });

  it(`returns false if value is instance`, () => {
    expect(isType(test)).toBeFalse();
  });

  it(`returns false if value is named function`, () => {
    expect(isType(TestFunction)).toBeFalse();
  });

  it(`returns false if value is anonymous function`, () => {
    expect(isType(() => null)).toBeFalse();
  });

  it(`returns false if value is plain object`, () => {
    expect(isType({ a: 0 })).toBeFalse();
  });
});
