import { Path, pathAsString } from '../path';

/**
 * Creates a path exists error.
 */
export class PathExistsError extends Error {
  /**
   * Creates a path exists error.
   * @param path The path.
   * @see {@link Path}
   */
  constructor(path: Path) {
    super(`The path "${pathAsString(path)}" already exists in the environment`);
    this.name = 'PathExistsError';
  }
}
