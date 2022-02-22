import { PropertyPathExistsError } from './property-path-exists.error';

describe('PropertyPathExistsError', () => {
  let error: PropertyPathExistsError;

  beforeEach(() => {
    error = new PropertyPathExistsError(['a', 'a']);
  });

  it(`name is PropertyPathExistsError`, () => {
    expect(error.name).toEqual('PropertyPathExistsError');
  });

  it(`message converts Path as string`, () => {
    expect(error.message).toEqual('Property path "a.a" already exists in the environment');
  });

  it(`stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
