import createMockInstance from 'jest-create-mock-instance';

import { DefaultEnvironmentStore, EnvironmentStore } from '../store';
import { createEnvironmentQuery } from './create-environment-query.function';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { DefaultEnvironmentQuery } from './environment-query.application';

describe('createEnvironmentQuery(store, config?)', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = createMockInstance(DefaultEnvironmentStore);
  });

  it(`(store) returns an EnvironmentQuery`, () => {
    const query: any = createEnvironmentQuery(store);

    expect(query).toBeInstanceOf(DefaultEnvironmentQuery);
    expect(query.config).toEqual({ interpolation: ['{{', '}}'], transpileEnvironment: false });
  });

  it(`(store,config) returns an EnvironmentQuery with custom config`, () => {
    const config: EnvironmentQueryConfig = { interpolation: ['(', ')'], transpileEnvironment: true };
    const query: any = createEnvironmentQuery(store, config);

    expect(query).toBeInstanceOf(DefaultEnvironmentQuery);
    expect(query.config).toEqual(config);
  });
});
