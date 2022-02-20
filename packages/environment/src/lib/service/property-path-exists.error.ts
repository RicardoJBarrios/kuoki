import { asString } from '../helpers';
import { isPath, pathAsString } from '../path';

/**
 * Creates a property path exists error.
 */
export class PropertyPathExistsError extends Error {
  /**
   * Creates a property path exists error.
   * @param path the property path.
   */
  constructor(path: unknown) {
    super(`Property path "${isPath(path) ? pathAsString(path) : asString(path)}" already exists in the environment`);
    this.name = 'PropertyPathExistsError';
  }
}
