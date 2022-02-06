import { ObservableInput } from 'rxjs';

import { Path } from '../path';
import { EnvironmentState } from '../store';

/**
 * The source from which to get environment properties asynchronously.
 */
export abstract class EnvironmentSource {
  /**
   * The internal id.
   *
   * This id is used by the loader to manage sources, so it must never be duplicated.
   * If left undefined, the loader will assign a random id.
   */
  id?: string;

  /**
   * The source name.
   *
   * Set the name if you're planning to use a loader source lifecycle to add custom behavior to the source.
   * Avoid the use of `constructor.name` because if the code is minimized or uglified on build the constructor
   * name changes.
   */
  name?: string;

  /**
   * Resolves the required to load sources before the environment load.
   *
   * - If there is no required to load sources the loader will resolve immedialely.
   * - If a required to load source never completes the loader will never resolve.
   * - The loader will reject after a required to load source error.
   * - The loader will resolves normally after a no required to load source error.
   */
  requiredToLoad?: boolean;

  /**
   * Loads the source in the declaration order.
   *
   * - The sources will wait until the previous loadInOrder source completes to add the properties.
   * - The not loadInOrder sources will add properties all at once.
   * - If a source never completes will never set the next ordered source properties.
   * - If a source returns an error will be ignored and will continue with the next ordered source.
   */
  loadInOrder?: boolean;

  /**
   * Adds properties to the environment using the deep merge strategy.
   * @see {@link EnvironmentService.merge}
   */
  mergeProperties?: boolean;

  /**
   * Ignores the errors thrown by the source.
   *
   * If a required to load source throws an error the loader will rejects, but if the `ignoreError` property is set
   * to `true` the error will be ignored as a no required to load source error.
   */
  ignoreError?: boolean;

  /**
   * The path to set the properties in the environment.
   * @see {@link Path}
   * @see {@link EnvironmentService.add}
   */
  path?: Path;

  /**
   * Asynchronously loads the environment properties from the source.
   */
  abstract load(): ObservableInput<EnvironmentState>;
}
