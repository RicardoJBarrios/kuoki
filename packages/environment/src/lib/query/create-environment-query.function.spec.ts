import { EnvironmentStore } from '../store';
import { TestEnvironmentStore } from '../store/environment-store.gateway.spec';
import { createEnvironmentQuery } from './create-environment-query.function';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { EnvironmentQuery } from './environment-query.application';

describe('createEnvironmentQuery(store, config?)', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = new TestEnvironmentStore();
  });

  it(`(store) returns an EnvironmentQuery`, () => {
    const query: any = createEnvironmentQuery(store);
    expect(query).toBeInstanceOf(EnvironmentQuery);
    expect(query.config).toEqual({ interpolation: ['{{', '}}'], transpileEnvironment: false });
  });

  it(`(store, config) returns an EnvironmentQuery with custom config`, () => {
    const config: EnvironmentQueryConfig = { interpolation: ['(', ')'], transpileEnvironment: true };
    const query: any = createEnvironmentQuery(store, config);
    expect(query).toBeInstanceOf(EnvironmentQuery);
    expect(query.config).toEqual(config);
  });
});
