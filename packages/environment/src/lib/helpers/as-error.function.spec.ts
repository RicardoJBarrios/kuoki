import { asError } from './as-error.function';

describe('asError(error)', () => {
  it(`returns an Error from Error`, () => {
    const error = new Error('a');
    expect(asError(error)).toEqual(new Error('a'));
  });

  it(`returns an Error from string`, () => {
    const error = 'a';
    expect(asError(error)).toEqual(new Error('a'));
  });

  it(`returns an Error from number`, () => {
    const error = 1;
    expect(asError(error)).toEqual(new Error('1'));
  });

  it(`returns an Error from boolean`, () => {
    const error = true;
    expect(asError(error)).toEqual(new Error('true'));
  });

  it(`returns an Error from null`, () => {
    const error = null;
    expect(asError(error)).toEqual(new Error('null'));
  });

  it(`returns an Error from Object`, () => {
    const error = { a: 0 };
    expect(asError(error)).toEqual(new Error('{"a":0}'));
  });
});
