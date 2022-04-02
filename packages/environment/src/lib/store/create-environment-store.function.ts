import { EnvironmentState } from './environment-state.type';
import { DefaultEnvironmentStore } from './environment-store.application';
import { EnvironmentStore } from './environment-store.gateway';

/**
 * Creates an environment store instance.
 * @param initialState The initial environment state.
 * @returns A default environment store instance.
 */
export function createEnvironmentStore(initialState?: EnvironmentState): EnvironmentStore {
  return new DefaultEnvironmentStore(initialState);
}
