import { Observable } from 'rxjs';

import { EnvironmentState } from './environment-state.type';

/**
 * Stores the properties that the application needs.
 */
export abstract class EnvironmentStore {
  /**
   * Gets all EnvironmentState properties as Observable.
   * @returns The EnvironmentState properties as Observable.
   */
  abstract getAll$(): Observable<EnvironmentState>;

  /**
   * Gets all EnvironmentState properties.
   * @returns The EnvironmentStore properties.
   */
  abstract getAll(): EnvironmentState;

  /**
   * Updates EnvironmentState properties.
   * @param environment The new EnvironmentState properties.
   */
  abstract update(environment: EnvironmentState): void;

  /**
   * Resets the EnvironmentState to the initial.
   */
  abstract reset(): void;
}
