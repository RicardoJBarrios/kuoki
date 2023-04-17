import { Path } from './path.type';
import { pathAsString } from './path-as-string.function';

/**
 * Represents an error when a path doesn't exist.
 */
export class PathDoesntExistError extends Error {
  /**
   * The path that doesn't exist.
   */
  path!: Path;

  /**
   * Represents an error when a path doesn't exist.
   * @param path The path that doesn't exist.
   */
  constructor(path: Path) {
    super(`The path "${pathAsString(path)}" doesn't exist in the environment`);
    this.name = 'PathDoesntExistError';
    this.path = path;
  }
}
