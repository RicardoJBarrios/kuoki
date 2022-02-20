import { PropertyPathExistsError } from './property-path-exists.error';

describe('PropertyPathExistsError', () => {
  it(`name is PropertyPathExistsError`, () => {
    const error = new PropertyPathExistsError('');
    expect(error.name).toEqual('PropertyPathExistsError');
  });

  it(`stack is defined`, () => {
    const error = new PropertyPathExistsError('');
    expect(error.stack).toBeDefined();
  });

  it(`message converts Path as string`, () => {
    const error = new PropertyPathExistsError(['a', 'a']);
    expect(error.message).toEqual('Property path "a.a" already exists in the environment');
  });

  it(`message converts no Path as string`, () => {
    const error = new PropertyPathExistsError(['2a', 'a']);
    expect(error.message).toEqual('Property path "["2a","a"]" already exists in the environment');
  });
});
