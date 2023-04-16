import { EnvironmentState } from './environment-state.type';
import { DefaultEnvironmentStore } from './environment-store.application';
import { EnvironmentStore } from './environment-store.interface';

/**
 * Creates a DefaultEnvironmentStore instance.
 * @param initialState The initial EnvironmentState.
 * @returns A DefaultEnvironmentStore instance.
 */
export function createEnvironmentStore(initialState: EnvironmentState = {}): EnvironmentStore {
  return new DefaultEnvironmentStore(initialState);
}
