import createMockInstance from 'jest-create-mock-instance';
import { Observable } from 'rxjs';

import { EnvironmentState, EnvironmentStore } from '../store';
import { createEnvironmentQuery } from './create-environment-query.function';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { EnvironmentQuery } from './environment-query.application';

export class TestEnvironmentStore extends EnvironmentStore {
  getAll$(): Observable<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
  getAll(): EnvironmentState {
    throw new Error('Method not implemented.');
  }
  update(environment: EnvironmentState): void {}
  reset(): void {}
}

describe('createEnvironmentQuery(store, config?)', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = createMockInstance(TestEnvironmentStore);
  });

  it(`(store) returns an EnvironmentQuery`, () => {
    const query: any = createEnvironmentQuery(store);

    expect(query).toBeInstanceOf(EnvironmentQuery);
    expect(query.config).toEqual({ interpolation: ['{{', '}}'], transpileEnvironment: false });
  });

  it(`(store,config) returns an EnvironmentQuery with custom config`, () => {
    const config: EnvironmentQueryConfig = { interpolation: ['(', ')'], transpileEnvironment: true };
    const query: any = createEnvironmentQuery(store, config);

    expect(query).toBeInstanceOf(EnvironmentQuery);
    expect(query.config).toEqual(config);
  });
});
