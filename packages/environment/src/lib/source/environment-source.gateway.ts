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
   * If is undefined, the loader will assign a random value.
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
   * - Wait for another source to complete to start the load.
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
   * @see {@link Path}
   * @see {@link EnvironmentService.add}
   * @see {@link EnvironmentService.merge}
   */
  path?: Path;

  /**
   * Asynchronously loads the environment properties from the source.
   */
  abstract load(): ObservableInput<EnvironmentState>;
}
