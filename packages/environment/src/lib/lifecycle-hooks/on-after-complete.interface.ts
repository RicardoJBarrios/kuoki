/**
 * A lifecycle hook that is called after all environment sources completes.
 */
export interface OnAfterComplete {
  /**
   * Handles any additional tasks after all environment sources completes.
   */
  onAfterComplete(): void;
}
