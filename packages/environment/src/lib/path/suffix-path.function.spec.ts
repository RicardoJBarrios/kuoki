import { suffixPath } from './suffix-path.function';

describe('suffixPath(path, preffix)', () => {
  it(`returns suffixed array from array path and array suffix`, () => {
    expect(suffixPath(['a', 'a'], ['b', 'b'])).toEqual(['a', 'a', 'b', 'b']);
  });

  it(`returns suffixed array from array path and string suffix`, () => {
    expect(suffixPath(['a', 'a'], 'b.b')).toEqual(['a', 'a', 'b', 'b']);
  });

  it(`returns suffixed string from string path and string suffix`, () => {
    expect(suffixPath('a.a', 'b.b')).toEqual('a.a.b.b');
  });

  it(`returns suffixed string from string path and array suffix`, () => {
    expect(suffixPath('a.a', ['b', 'b'])).toEqual('a.a.b.b');
  });
});
