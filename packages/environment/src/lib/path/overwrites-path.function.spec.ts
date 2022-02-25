import { overwritesPath } from './overwrites-path.function';

describe('overwritesPath(path,environment)', () => {
  it(`returns true if any value in path is not an object`, () => {
    const environment = { a: { b: 0 } };

    expect(overwritesPath('a.b', environment)).toBeTrue();
    expect(overwritesPath('a.b.c.d', environment)).toBeTrue();
  });

  it(`returns false if is an invalid path`, () => {
    const environment = { a: {} };

    expect(overwritesPath([], environment)).toBeFalse();
    expect(overwritesPath('', environment)).toBeFalse();
    expect(overwritesPath('2a', environment)).toBeFalse();
  });

  it(`returns false if path is not in environment`, () => {
    const environment = { a: { b: {} } };

    expect(overwritesPath('z', environment)).toBeFalse();
    expect(overwritesPath('b.b', environment)).toBeFalse();
    expect(overwritesPath('a.b.c', environment)).toBeFalse();
  });

  it(`returns false if all values in path are objects or nil`, () => {
    const environment = { a: { b: {}, c: null } };

    expect(overwritesPath('a', environment)).toBeFalse();
    expect(overwritesPath('a.b', environment)).toBeFalse();
    expect(overwritesPath('a.b.c.d', environment)).toBeFalse();
    expect(overwritesPath('a.c', environment)).toBeFalse();
    expect(overwritesPath('a.c.d', environment)).toBeFalse();
  });
});
