import { pathAsArray } from './path-as-array.function';

describe('pathAsArray(path)', () => {
  it(`returns the path as Array if is a string`, () => {
    expect(pathAsArray('a.a')).toEqual(['a', 'a']);
  });

  it(`returns the path as Array if is an Array`, () => {
    expect(pathAsArray(['a', 'a'])).toEqual(['a', 'a']);
  });
});
