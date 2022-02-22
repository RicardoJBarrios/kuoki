import { Path, pathAsString } from '../path';

/**
 * Creates a property path exists error.
 */
export class PropertyPathExistsError extends Error {
  /**
   * Creates a property path exists error.
   * @param path the property path.
   */
  constructor(path: Path) {
    super(`Property path "${pathAsString(path)}" already exists in the environment`);
    this.name = 'PropertyPathExistsError';
  }
}
