import { PathExistsError } from './path-exists.error';

describe('PathExistsError', () => {
  let error: PathExistsError;

  beforeEach(() => {
    error = new PathExistsError(['a', 'a']);
  });

  it(`#name is PathExistsError`, () => {
    expect(error.name).toEqual('PathExistsError');
  });

  it(`#message converts Path as string`, () => {
    expect(error.message).toEqual('The path "a.a" already exists in the environment');
  });

  it(`#path is stored`, () => {
    expect(error.path).toEqual(['a', 'a']);
  });

  it(`#stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
