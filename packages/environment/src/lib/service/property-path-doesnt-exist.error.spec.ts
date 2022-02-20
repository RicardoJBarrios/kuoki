import { PropertyPathDoesntExistError } from './property-path-doesnt-exist.error';

describe('PropertyPathDoesntExistError', () => {
  it(`name is PropertyPathDoesntExistError`, () => {
    const error = new PropertyPathDoesntExistError('');
    expect(error.name).toEqual('PropertyPathDoesntExistError');
  });

  it(`stack is defined`, () => {
    const error = new PropertyPathDoesntExistError('');
    expect(error.stack).toBeDefined();
  });

  it(`message converts Path as string`, () => {
    const error = new PropertyPathDoesntExistError(['a', 'a']);
    expect(error.message).toEqual(`Property path "a.a" doesn't exist in the environment`);
  });

  it(`message converts no Path as string`, () => {
    const error = new PropertyPathDoesntExistError(['2a', 'a']);
    expect(error.message).toEqual(`Property path "["2a","a"]" doesn't exist in the environment`);
  });
});
