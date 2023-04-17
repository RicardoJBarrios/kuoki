import { EnvironmentReferenceError } from './environment-reference.error';

describe('EnvironmentReferenceError', () => {
  it(`extends from ReferenceError'`, () => {
    const error = new EnvironmentReferenceError('a.a');
    expect(error).toBeInstanceOf(ReferenceError);
  });

  it(`type is EnvironmentReferenceError'`, () => {
    const error = new EnvironmentReferenceError('a.a');
    expect(error).toBeInstanceOf(EnvironmentReferenceError);
  });

  it(`#name is 'EnvironmentReferenceError'`, () => {
    const error = new EnvironmentReferenceError('a.a');
    expect(error.name).toEqual('EnvironmentReferenceError');
  });

  it(`#message displayed as string with string path`, () => {
    const error = new EnvironmentReferenceError('a.a');
    expect(error.message).toEqual('The environment property "a.a" is not defined');
  });

  it(`#message displayed as string with Array path`, () => {
    const error = new EnvironmentReferenceError(['a', 'a']);
    expect(error.message).toEqual('The environment property "a.a" is not defined');
  });

  it(`#path stored as string`, () => {
    const error = new EnvironmentReferenceError('a.a');
    expect(error.path).toEqual('a.a');
  });

  it(`#path stored as Array`, () => {
    const error = new EnvironmentReferenceError(['a', 'a']);
    expect(error.path).toEqual(['a', 'a']);
  });

  it(`#stack is defined`, () => {
    const error = new EnvironmentReferenceError('a');
    expect(error.stack).toBeDefined();
  });
});
