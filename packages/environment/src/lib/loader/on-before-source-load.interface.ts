import { EnvironmentSource } from '../source';

/**
 * A lifecycle hook that is called before a source starts to load the properties.
 */
export interface OnBeforeSourceLoad {
  /**
   * Handles any additional tasks before a source starts to load the properties.
   * @param source The source to load.
   */
  onBeforeSourceLoad(source: Required<EnvironmentSource>): void;
}
