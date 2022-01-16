import { pathAsString } from './path-as-string.function';

describe('pathAsString(path)', () => {
  it(`returns the path as string if is a string`, () => {
    expect(pathAsString('a.a')).toEqual('a.a');
  });

  it(`returns the path as string if is an Array`, () => {
    expect(pathAsString(['a', 'a'])).toEqual('a.a');
  });
});
