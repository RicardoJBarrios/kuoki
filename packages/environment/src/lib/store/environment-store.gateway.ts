import { Observable } from 'rxjs';

import { Environment } from './environment.type';

/**
 * Stores the environment properties that the application needs.
 */
export abstract class EnvironmentStore {
  /**
   * Gets all properties from the environment store.
   * @returns The environment properties as Observable.
   */
  abstract getAll$(): Observable<Environment>;

  /**
   * Gets all properties from the environment store.
   * @returns The environment properties.
   */
  abstract getAll(): Environment;

  /**
   * Updates the environment store.
   * @param environment The new environment properties.
   */
  abstract update(environment: Environment): void;
}
