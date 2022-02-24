import { LoaderSource } from '../loader-source';

/**
 * A lifecycle hook that is called after a source is rejected.
 */
export interface OnAfterSourceError {
  /**
   * Handles any additional tasks after a source is rejected.
   * @param error The source error.
   * @param source The rejected source.
   */
  onAfterSourceError(error: Error, source: LoaderSource): void;
}
