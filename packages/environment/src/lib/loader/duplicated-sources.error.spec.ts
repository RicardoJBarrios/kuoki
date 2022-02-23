import { DuplicatedSourcesError } from './duplicated-sources.error';

describe('DuplicatedSourcesError', () => {
  let error: DuplicatedSourcesError;

  beforeEach(() => {
    error = new DuplicatedSourcesError(['a', 'b']);
  });

  it(`name is DuplicatedSourcesError`, () => {
    expect(error.name).toEqual('DuplicatedSourcesError');
  });

  it(`message displays the ids`, () => {
    expect(error.message).toEqual(`There are sources with duplicate id's: a, b`);
  });

  it(`stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
