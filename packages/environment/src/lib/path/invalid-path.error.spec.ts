import { InvalidPathError } from './invalid-path.error';

describe('InvalidPathError', () => {
  let error: InvalidPathError;

  beforeEach(() => {
    error = new InvalidPathError(['2a', 'a']);
  });

  it(`name is InvalidPathError`, () => {
    expect(error.name).toEqual('InvalidPathError');
  });

  it(`message converts paths to string`, () => {
    expect(error.message).toEqual(`The path "["2a","a"]" is invalid`);
  });

  it(`stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
