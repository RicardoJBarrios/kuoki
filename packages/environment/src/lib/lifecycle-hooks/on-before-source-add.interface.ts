import { LoaderSource } from '../loader-source';
import { EnvironmentState } from '../store';

/**
 * A lifecycle hook that is called before a source properties are added to the environment.
 * This hook is executed before the `preAddProperties()` middleware method.
 */
export interface OnBeforeSourceAdd {
  /**
   * Handles any additional tasks before a source properties are added to the environment.
   * @param properties The properties returned by the source.
   * @param source The loaded source.
   */
  onBeforeSourceAdd(properties: EnvironmentState, source: LoaderSource): void;
}
