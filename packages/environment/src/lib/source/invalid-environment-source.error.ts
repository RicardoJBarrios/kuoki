import { asString } from '../helpers';

/**
 * Creates an invalid environment source error.
 */
export class InvalidEnvironmentSourceError extends Error {
  /**
   * Creates an invalid environment source error.
   * @param source The environment source.
   */
  constructor(source: any) {
    super();
    this.message = `The source "${this.getName(source)}" is invalid`;
    this.name = 'InvalidEnvironmentSourceError';
  }

  protected getName(source: any): string {
    if (source?.id) {
      return source.id;
    }

    if (typeof source === 'object' && source != null && source.constructor.name !== 'Object') {
      return source.constructor.name;
    }

    if (typeof source === 'function' && source.name && source.name !== 'Function') {
      return source.name;
    }

    return asString(source);
  }
}
