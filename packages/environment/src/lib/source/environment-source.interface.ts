import { ObservableInput } from 'rxjs';

import { Path } from '../path';
import { EnvironmentState } from '../store';
import { SourceStrategy } from './source-strategy.enum';

/**
 * The source from which to get environment properties.
 */
export abstract class EnvironmentSource {
  /**
   * Used by the loader to manage sources, so it must never be duplicated.
   * If not defined, the loader will assign a random id.
   */
  id?: string;

  /**
   * Resolves the required sources before the environment load.
   *
   * - Resolves immedialely if there is no required sources.
   * - Never resolves if a required source doesn't complete.
   * - Rejects after a required source error.
   * - Resolves after a no required source error.
   */
  isRequired?: boolean;

  /**
   * Loads the source in the declaration order.
   *
   * - Waits for another source to complete to start the load.
   * - Unordered sources add all properties at once.
   * - Never loads if previous ordered source doesn't complete.
   * - Ignore errors and continues with the next ordered source.
   */
  isOrdered?: boolean;

  /**
   * Ignores the error if the required source throws.
   */
  ignoreError?: boolean;

  /**
   * The strategy to add properties to the environment.
   */
  strategy?: SourceStrategy;

  /**
   * The path to set the properties in the environment.
   */
  path?: Path;

  /**
   * Loads the environment properties from the source.
   */
  abstract load(): EnvironmentState | ObservableInput<EnvironmentState>;

  /**
   * A function to map the value returned by `load()` before store it.
   */
  mapFn?: (properties: EnvironmentState) => EnvironmentState;

  /**
   * A function to manage errors.
   */
  errorHandler?: <E>(error: E) => EnvironmentState;
}
