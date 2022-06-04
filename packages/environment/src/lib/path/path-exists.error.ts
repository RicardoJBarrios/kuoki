import { pathAsString } from './path-as-string.function';
import { Path } from './path.type';

/**
 * Creates a path exists error.
 */
export class PathExistsError extends Error {
  /**
   * Creates a path exists error.
   * @param path The path.
   */
  constructor(path: Path) {
    super(`The path "${pathAsString(path)}" already exists in the environment`);
    this.name = 'PathExistsError';
  }
}
