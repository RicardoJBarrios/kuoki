import { asString } from '../helpers';
import { isPath } from './is-path.function';
import { pathAsString } from './path-as-string.function';

/**
 * Creates an invalid path error.
 */
export class InvalidPathError extends Error {
  /**
   * Creates an invalid path error.
   * @param path the invalid path.
   */
  constructor(path: unknown) {
    super(`The path "${isPath(path) ? pathAsString(path) : asString(path)}" is invalid`);
    this.name = 'InvalidPathError';
  }
}
