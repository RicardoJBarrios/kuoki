import { Path, pathAsString } from '../path';

/**
 * Creates a property path doesn't exist error.
 */
export class PropertyPathDoesntExistError extends Error {
  /**
   * Creates a property path doesn't exist error.
   * @param path The property path.
   */
  constructor(path: Path) {
    super(`Property path "${pathAsString(path)}" doesn't exist in the environment`);
    this.name = 'PropertyPathDoesntExistError';
  }
}
