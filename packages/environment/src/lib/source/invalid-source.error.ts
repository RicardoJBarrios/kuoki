import { asString } from '../helpers';

/**
 * Creates an invalid environment source error.
 * @see {@link isEnvironmentSource}
 */
export class InvalidSourceError extends Error {
  /**
   * Creates an invalid environment source error.
   * @param source The environment source.
   */
  constructor(source: any) {
    super();
    this.message = `The source "${this.getId(source)}" is invalid`;
    this.name = 'InvalidSourceError';
  }

  protected getId(source: any): string {
    if (source == null) {
      return asString(source);
    }

    if (source.id) {
      return source.id;
    }

    if (this.isNamedObject(source)) {
      return source.constructor.name;
    }

    if (this.isNamedFunction(source)) {
      return source.name;
    }

    return asString(source);
  }

  protected isNamedObject(source: any): boolean {
    return typeof source === 'object' && source.constructor.name && source.constructor.name !== 'Object';
  }

  protected isNamedFunction(source: any): boolean {
    return typeof source === 'function' && source.name && source.name !== 'Function';
  }
}
