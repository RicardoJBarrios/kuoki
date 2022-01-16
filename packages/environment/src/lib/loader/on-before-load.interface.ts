/**
 * A lifecycle hook that is called before start the environment sources load.
 */
export interface OnBeforeLoad {
  /**
   * Handles any additional tasks before start the environment sources load.
   */
  onBeforeLoad(): void;
}
