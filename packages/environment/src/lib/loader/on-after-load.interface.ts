/**
 * A lifecycle hook that is called after the load is resolved.
 */
export interface OnAfterLoad {
  /**
   * Handles any additional tasks after the load is resolved.
   */
  onAfterLoad(): void;
}
