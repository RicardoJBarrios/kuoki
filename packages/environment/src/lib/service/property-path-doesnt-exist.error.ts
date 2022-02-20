import { asString } from '../helpers';
import { isPath, pathAsString } from '../path';

/**
 * Creates a property path doesn't exist error.
 */
export class PropertyPathDoesntExistError extends Error {
  /**
   * Creates a property path doesn't exist error.
   * @param path the property path.
   */
  constructor(path: unknown) {
    super(`Property path "${isPath(path) ? pathAsString(path) : asString(path)}" doesn't exist in the environment`);
    this.name = 'PropertyPathDoesntExistError';
  }
}
