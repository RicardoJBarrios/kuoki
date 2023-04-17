import { Path } from './path.type';
import { pathAsString } from './path-as-string.function';

/**
 * Represents an error when a path exists.
 */
export class PathExistsError extends Error {
  /**
   * The path that exists.
   */
  path!: Path;

  /**
   * Represents an error when a path exists.
   * @param path The path that exists.
   */
  constructor(path: Path) {
    super(`The path "${pathAsString(path)}" already exists in the environment`);
    this.name = 'PathExistsError';
    this.path = path;
  }
}
