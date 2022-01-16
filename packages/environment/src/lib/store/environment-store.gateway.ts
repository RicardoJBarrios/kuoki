import { Observable } from 'rxjs';

import { EnvironmentState } from './environment-state.type';

/**
 * Stores the environment properties that the application needs.
 */
export abstract class EnvironmentStore {
  /**
   * Gets all properties from the environment store.
   * @returns The environment properties as Observable.
   * @example
   * ```js
   * store.getAll$(); // ^-{a:0}--{a:0,b:0}-
   * ```
   */
  abstract getAll$(): Observable<EnvironmentState>;

  /**
   * Gets all properties from the environment store.
   * @returns The environment properties.
   * @example
   * ```js
   * store.getAll(); // {a:0}
   * ```
   */
  abstract getAll(): EnvironmentState;

  /**
   * Updates the environment store.
   * @param environment The new environment properties.
   * @example
   * ```js
   * store.update({a:0});
   * ```
   */
  abstract update(environment: EnvironmentState): void;

  /**
   * Resets the environment store to the initial state.
   * @example
   * ```js
   * store.reset();
   * ```
   */
  abstract reset(): void;
}
