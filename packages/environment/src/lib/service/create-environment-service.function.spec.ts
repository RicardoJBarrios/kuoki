import { EnvironmentStore } from '../store';
import { TestEnvironmentStore } from '../store/environment-store.gateway.spec';
import { createEnvironmentService } from './create-environment-service.function';
import { EnvironmentService } from './environment-service.application';

describe('createEnvironmentService(store)', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = new TestEnvironmentStore();
  });

  it(`returns an EnvironmentService`, () => {
    expect(createEnvironmentService(store)).toBeInstanceOf(EnvironmentService);
  });
});
