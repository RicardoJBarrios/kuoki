import createMockInstance from 'jest-create-mock-instance';

import { DefaultEnvironmentStore, EnvironmentStore } from '../store';
import { createEnvironmentService } from './create-environment-service.function';
import { DefaultEnvironmentService } from './environment-service.application';

describe('createEnvironmentService(store)', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = createMockInstance(DefaultEnvironmentStore);
  });

  it(`returns an EnvironmentService`, () => {
    expect(createEnvironmentService(store)).toBeInstanceOf(DefaultEnvironmentService);
  });
});
