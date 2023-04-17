import { PathDoesntExistError } from './path-doesnt-exist.error';

describe('PathDoesntExistError', () => {
  let error: PathDoesntExistError;

  beforeEach(() => {
    error = new PathDoesntExistError(['a', 'a']);
  });

  it(`#name is PathDoesntExistError`, () => {
    expect(error.name).toEqual('PathDoesntExistError');
  });

  it(`#message converts Path as string`, () => {
    expect(error.message).toEqual(`The path "a.a" doesn't exist in the environment`);
  });

  it(`#path is stored`, () => {
    expect(error.path).toEqual(['a', 'a']);
  });

  it(`#stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
