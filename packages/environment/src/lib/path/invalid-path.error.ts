import { asString } from '../helpers';

/**
 * Represents an error when a path is invalid.
 */
export class InvalidPathError extends Error {
  /**
   * The invalid path.
   */
  path!: unknown;

  /**
   * Represents an error when a path is invalid.
   * @param path the invalid path.
   */
  constructor(path: unknown) {
    super(`The path "${asString(path)}" is invalid`);
    this.name = 'InvalidPathError';
    this.path = path;
  }
}
