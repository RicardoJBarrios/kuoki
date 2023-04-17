import { Path, pathAsString } from '../path';

/**
 * Represents an error when an EnvironmentState property doesn't exist (or hasn't yet been initialized).
 */
export class EnvironmentReferenceError extends ReferenceError {
  /**
   * The undefined path.
   */
  path!: Path;

  /**
   * Represents an error when an EnvironmentState property doesn't exist (or hasn't yet been initialized).
   * @param path The undefined path.
   */
  constructor(path: Path) {
    super(`The environment property "${pathAsString(path)}" is not defined`);
    this.name = 'EnvironmentReferenceError';
    this.path = path;
  }
}
