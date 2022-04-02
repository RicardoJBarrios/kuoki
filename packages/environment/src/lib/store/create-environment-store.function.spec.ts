import { createEnvironmentStore, DefaultEnvironmentStore } from '../store';

describe('createEnvironmentStore(initialState?)', () => {
  it(`returns a DefaultEnvironmentStore with the default initial state '{}' `, () => {
    const store: any = createEnvironmentStore();
    expect(store).toBeInstanceOf(DefaultEnvironmentStore);
    expect(store.initialState).toEqual({});
  });

  it(`returns a DefaultEnvironmentStore with a custom initial state`, () => {
    const initialState = { a: 0 };
    const store: any = createEnvironmentStore(initialState);
    expect(store).toBeInstanceOf(DefaultEnvironmentStore);
    expect(store.initialState).toEqual(initialState);
  });
});
