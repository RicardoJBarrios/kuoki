import { DuplicatedEnvironmentSourcesError } from './duplicated-environment-sources.error';

describe('DuplicatedEnvironmentSourcesError', () => {
  let error: DuplicatedEnvironmentSourcesError;

  beforeEach(() => {
    error = new DuplicatedEnvironmentSourcesError(['a', 'b']);
  });

  it(`#name is DuplicatedEnvironmentSourcesError`, () => {
    expect(error.name).toEqual('DuplicatedEnvironmentSourcesError');
  });

  it(`#message displays the ids`, () => {
    expect(error.message).toEqual(`There are environment sources with duplicate id's: a, b`);
  });

  it(`#ids is stored`, () => {
    expect(error.ids).toEqual(['a', 'b']);
  });

  it(`#stack is defined`, () => {
    expect(error.stack).toBeDefined();
  });
});
