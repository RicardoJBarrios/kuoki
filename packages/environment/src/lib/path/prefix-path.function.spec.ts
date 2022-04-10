import { prefixPath } from './prefix-path.function';

describe('prefixPath(path, preffix)', () => {
  it(`returns prefixed array from array path and array prefix`, () => {
    expect(prefixPath(['a', 'a'], ['b', 'b'])).toEqual(['b', 'b', 'a', 'a']);
  });

  it(`returns prefixed array from array path and string prefix`, () => {
    expect(prefixPath(['a', 'a'], 'b.b')).toEqual(['b', 'b', 'a', 'a']);
  });

  it(`returns prefixed string from string path and string prefix`, () => {
    expect(prefixPath('a.a', 'b.b')).toEqual('b.b.a.a');
  });

  it(`returns prefixed string from string path and array prefix`, () => {
    expect(prefixPath('a.a', ['b', 'b'])).toEqual('b.b.a.a');
  });
});
