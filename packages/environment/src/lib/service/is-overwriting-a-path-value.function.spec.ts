import { isOverwritingAPathValue } from './is-overwriting-a-path-value.function';

describe('isOverwritingAPathValue(path, environment)', () => {
  it(`returns false if path lenght 0`, () => {
    const path: string[] = [];
    const environment = { a: {} };
    expect(isOverwritingAPathValue(path, environment)).toEqual(false);
  });

  it(`returns true if path lenght 1 and value is not an object`, () => {
    const path = ['a'];
    const environment = { a: 0 };
    expect(isOverwritingAPathValue(path, environment)).toEqual(true);
  });

  it(`returns false if path lenght 1 and value is an object`, () => {
    const path = ['a'];
    const environment = { a: {} };
    expect(isOverwritingAPathValue(path, environment)).toEqual(false);
  });

  it(`returns false if path lenght 1 and not in environment`, () => {
    const path = ['z'];
    const environment = { a: 0 };
    expect(isOverwritingAPathValue(path, environment)).toEqual(false);
  });

  it(`returns true if any value is not an object`, () => {
    const path = ['a', 'b', 'c', 'd'];
    const environment = { a: { b: { c: { d: 0 } } } };
    expect(isOverwritingAPathValue(path, environment)).toEqual(true);
  });

  it(`returns true if any value is not an object or undefined`, () => {
    const path = ['x', 'y', 'z', 'a'];
    const environment = { x: { y: 0 } };
    expect(isOverwritingAPathValue(path, environment)).toEqual(true);
  });

  it(`returns false if all values are objects`, () => {
    const path = ['a', 'b', 'c', 'd'];
    const environment = { a: { b: { c: { d: {} } } } };
    expect(isOverwritingAPathValue(path, environment)).toEqual(false);
  });

  it(`returns false if all values are objects or undefined`, () => {
    const path = ['a', 'b', 'c', 'd'];
    const environment = { a: { b: {} } };
    expect(isOverwritingAPathValue(path, environment)).toEqual(false);
  });

  it(`returns false if path not in environment`, () => {
    const path = ['b', 'b'];
    const environment = { a: { b: {} } };
    expect(isOverwritingAPathValue(path, environment)).toEqual(false);
  });
});
