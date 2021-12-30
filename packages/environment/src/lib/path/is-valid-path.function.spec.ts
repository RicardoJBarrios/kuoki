import { isValidPath } from './is-valid-path.function';

describe('isValidPath(value)', () => {
  it(`returns false if no string or Array`, () => {
    expect(isValidPath(null)).toEqual(false);
    expect(isValidPath(0)).toEqual(false);
    expect(isValidPath(true)).toEqual(false);
    expect(isValidPath({})).toEqual(false);
    expect(isValidPath({ a: '' })).toEqual(false);
  });

  it(`returns false if empty string ""`, () => {
    expect(isValidPath('')).toEqual(false);
  });

  it(`returns false if empty Array`, () => {
    expect(isValidPath([])).toEqual(false);
  });

  it(`returns true if contains ASCII letter (a-zA-Z)`, () => {
    expect(isValidPath('a')).toEqual(true);
    expect(isValidPath('azAZ')).toEqual(true);
  });

  it(`returns true if contains number (0-9)`, () => {
    expect(isValidPath('a09')).toEqual(true);
  });

  it(`returns true if contains underscore "_"`, () => {
    expect(isValidPath('_')).toEqual(true);
    expect(isValidPath('_azAZ09_')).toEqual(true);
  });

  it(`returns true if contains dollar "$"`, () => {
    expect(isValidPath('$')).toEqual(true);
    expect(isValidPath('$azAZ09$')).toEqual(true);
  });

  it(`returns false if starts with number (0-9)`, () => {
    expect(isValidPath('2')).toEqual(false);
    expect(isValidPath('09azAZ')).toEqual(false);
  });

  it(`returns false if key contains any other character`, () => {
    expect(isValidPath('a-')).toEqual(false);
    expect(isValidPath('a ')).toEqual(false);
  });

  it(`returns true for valid dot-separated keys`, () => {
    expect(isValidPath('a._.$.azAZ09$_')).toEqual(true);
  });

  it(`returns false if any invalid dot-separated key`, () => {
    expect(isValidPath('a._.$.azAZ09$_..')).toEqual(false);
    expect(isValidPath('a._.$.azAZ09$_.2a')).toEqual(false);
    expect(isValidPath('a._.$.azAZ09$_.a ')).toEqual(false);
    expect(isValidPath('a._.$.azAZ09$_.a-')).toEqual(false);
  });

  it(`returns true for valid Array keys`, () => {
    expect(isValidPath(['a'])).toEqual(true);
    expect(isValidPath(['a', '_', '$', 'azAZ09$_'])).toEqual(true);
  });

  it(`returns false if Array contains dot-separated key`, () => {
    expect(isValidPath(['a', 'a.a'])).toEqual(false);
  });

  it(`returns false if any invalid Array key`, () => {
    expect(isValidPath(['', '_'])).toEqual(false);
    expect(isValidPath(['2a', '_'])).toEqual(false);
    expect(isValidPath(['a ', '_'])).toEqual(false);
    expect(isValidPath(['a-', '_'])).toEqual(false);
  });
});
