import createMockInstance from 'jest-create-mock-instance';
import { Observable } from 'rxjs';

import { EnvironmentState, EnvironmentStore } from '../store';
import { createEnvironmentService } from './create-environment-service.function';
import { EnvironmentService } from './environment-service.application';

export class TestEnvironmentStore extends EnvironmentStore {
  getAll$(): Observable<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
  getAll(): EnvironmentState {
    throw new Error('Method not implemented.');
  }
  update(environment: EnvironmentState): void {
    throw new Error('Method not implemented.');
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }
}

describe('createEnvironmentService(store)', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = createMockInstance(TestEnvironmentStore);
  });

  it(`returns an EnvironmentService`, () => {
    expect(createEnvironmentService(store)).toBeInstanceOf(EnvironmentService);
  });
});
