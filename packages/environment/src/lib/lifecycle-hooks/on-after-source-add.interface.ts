import { LoaderSource } from '../loader-source';
import { EnvironmentState } from '../store';

/**
 * A lifecycle hook that is called after a source properties are added to the environment.
 */
export interface OnAfterSourceAdd {
  /**
   * Handles any additional tasks after a source properties are added to the environment.
   * @param properties The properties added to the environment.
   * @param source The loaded source.
   */
  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void;
}
