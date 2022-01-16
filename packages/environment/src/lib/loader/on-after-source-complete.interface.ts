import { EnvironmentSource } from '../source';

/**
 * A lifecycle hook that is called after a source complete.
 */
export interface OnAfterSourceComplete {
  /**
   * Handles any additional tasks after a source complete.
   * @param source The completed source.
   */
  onAfterSourceComplete(source: Required<EnvironmentSource>): void;
}
