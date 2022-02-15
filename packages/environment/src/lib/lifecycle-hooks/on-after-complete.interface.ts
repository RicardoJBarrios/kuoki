/**
 * A lifecycle hook that is called after all environment sources complete.
 */
export interface OnAfterComplete {
  /**
   * Handles any additional tasks after all environment sources complete.
   */
  onAfterComplete(): void;
}
