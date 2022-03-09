import { asString } from '../helpers';

/**
 * Creates an invalid path error.
 * @see {@link isPath}
 */
export class InvalidPathError extends Error {
  /**
   * Creates an invalid path error.
   * @param path the invalid path.
   */
  constructor(path: unknown) {
    super(`The path "${asString(path)}" is invalid`);
    this.name = 'InvalidPathError';
  }
}
