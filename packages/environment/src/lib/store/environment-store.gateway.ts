import { Observable } from 'rxjs';

import { EnvironmentState } from './environment-state.type';

/**
 * Stores the environment properties that the application needs.
 */
export abstract class EnvironmentStore {
  /**
   * Gets all properties from the environment store.
   * @returns The environment properties as Observable.
   * @see {@link Observable}
   * @see {@link EnvironmentState}
   */
  abstract getAll$(): Observable<EnvironmentState>;

  /**
   * Gets all properties from the environment store.
   * @returns The environment properties.
   * @see {@link EnvironmentState}
   */
  abstract getAll(): EnvironmentState;

  /**
   * Updates the environment store.
   * @param environment The new environment properties.
   * @see {@link EnvironmentState}
   */
  abstract update(environment: EnvironmentState): void;

  /**
   * Resets the environment store to the initial state.
   */
  abstract reset(): void;
}
