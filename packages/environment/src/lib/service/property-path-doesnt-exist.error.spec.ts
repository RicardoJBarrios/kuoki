import { PropertyPathDoesntExistError } from './property-path-doesnt-exist.error';

describe('PropertyPathDoesntExistError', () => {
  let error: PropertyPathDoesntExistError;

  beforeEach(() => {
    error = new PropertyPathDoesntExistError(['a', 'a']);
  });

  it(`name is PropertyPathDoesntExistError`, () => {
    expect(error.name).toEqual('PropertyPathDoesntExistError');
  });

  it(`message converts Path as string`, () => {
    expect(error.message).toEqual(`Property path "a.a" doesn't exist in the environment`);
  });

  it(`stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
