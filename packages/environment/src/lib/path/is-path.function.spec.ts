import { isPath } from './is-path.function';

describe('isPath(value)', () => {
  it(`returns false if no string or Array`, () => {
    expect(isPath(null)).toBeFalse();
    expect(isPath(0)).toBeFalse();
    expect(isPath(true)).toBeFalse();
    expect(isPath({})).toBeFalse();
    expect(isPath({ a: '' })).toBeFalse();
  });

  it(`returns false if empty string ""`, () => {
    expect(isPath('')).toBeFalse();
  });

  it(`returns false if empty Array`, () => {
    expect(isPath([])).toBeFalse();
  });

  it(`returns true if contains ASCII letter (a-zA-Z)`, () => {
    expect(isPath('a')).toBeTrue();
    expect(isPath('azAZ')).toBeTrue();
  });

  it(`returns true if contains number (0-9)`, () => {
    expect(isPath('a09')).toBeTrue();
  });

  it(`returns true if contains underscore "_"`, () => {
    expect(isPath('_')).toBeTrue();
    expect(isPath('_azAZ09_')).toBeTrue();
  });

  it(`returns true if contains dollar "$"`, () => {
    expect(isPath('$')).toBeTrue();
    expect(isPath('$azAZ09$')).toBeTrue();
  });

  it(`returns false if starts with number (0-9)`, () => {
    expect(isPath('2')).toBeFalse();
    expect(isPath('09azAZ')).toBeFalse();
  });

  it(`returns false if key contains any other character`, () => {
    expect(isPath('a-')).toBeFalse();
    expect(isPath('a ')).toBeFalse();
  });

  it(`returns true for valid dot-separated keys`, () => {
    expect(isPath('a._.$.azAZ09$_')).toBeTrue();
  });

  it(`returns false if any invalid dot-separated key`, () => {
    expect(isPath('a._.$.azAZ09$_..')).toBeFalse();
    expect(isPath('a._.$.azAZ09$_.2a')).toBeFalse();
    expect(isPath('a._.$.azAZ09$_.a ')).toBeFalse();
    expect(isPath('a._.$.azAZ09$_.a-')).toBeFalse();
  });

  it(`returns true for valid Array keys`, () => {
    expect(isPath(['a'])).toBeTrue();
    expect(isPath(['a', '_', '$', 'azAZ09$_'])).toBeTrue();
  });

  it(`returns false if Array contains dot-separated key`, () => {
    expect(isPath(['a', 'a.a'])).toBeFalse();
  });

  it(`returns false if any invalid Array key`, () => {
    expect(isPath(['', '_'])).toBeFalse();
    expect(isPath(['2a', '_'])).toBeFalse();
    expect(isPath(['a ', '_'])).toBeFalse();
    expect(isPath(['a-', '_'])).toBeFalse();
  });
});
