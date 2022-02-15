/**
 * A lifecycle hook that is called after the load is rejected.
 */
export interface OnAfterError {
  /**
   * Handles any additional tasks after the load is rejected.
   * @param error The load error.
   */
  onAfterError<E extends Error>(error: E): void;
}
