import { pathAsString } from './path-as-string.function';
import { Path } from './path.type';

/**
 * Creates a path doesn't exist error.
 */
export class PathDoesntExistError extends Error {
  /**
   * Creates a path doesn't exist error.
   * @param path The path.
   */
  constructor(path: Path) {
    super(`The path "${pathAsString(path)}" doesn't exist in the environment`);
    this.name = 'PathDoesntExistError';
  }
}
