import { Observable } from 'rxjs';

import { EnvironmentState } from './environment-state.type';
import { EnvironmentStore } from './environment-store.gateway';

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

describe('EnvironmentStore', () => {
  let store: EnvironmentStore;

  beforeEach(() => {
    store = new TestEnvironmentStore();
  });

  it(`has getAll$() method`, () => {
    expect(store).toHaveProperty('getAll$');
  });

  it(`has getAll() method`, () => {
    expect(store).toHaveProperty('getAll');
  });

  it(`has update() method`, () => {
    expect(store).toHaveProperty('update');
  });

  it(`has reset() method`, () => {
    expect(store).toHaveProperty('reset');
  });
});
