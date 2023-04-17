import { asString } from '../helpers';

/**
 * Creates an invalid EnvironmentSource error.
 */
export class InvalidEnvironmentSourceError extends Error {
  /**
   * The invalid EnvironmentSource.
   */
  source!: unknown;

  /**
   * Creates an invalid EnvironmentSource error.
   * @param source The invalid EnvironmentSource.
   */
  constructor(source: unknown) {
    super();
    this.message = `The source "${this.getId(source)}" is invalid`;
    this.name = 'InvalidEnvironmentSourceError';
    this.source = source;
  }

  protected getId(source: unknown): string {
    if (source == null) {
      return asString(source);
    }

    if (this.isObjectWithId(source)) {
      return source.id;
    }

    if (this.isNamedObject(source)) {
      return source.constructor.name;
    }

    if (this.isNamedFunction(source)) {
      return source['name'];
    }

    return asString(source);
  }

  protected isObjectWithId(source: unknown): source is { id: string } {
    return typeof source === 'object' && source != null && 'id' in source && typeof source.id === 'string';
  }

  protected isNamedObject(source: unknown): source is object {
    return (
      typeof source === 'object' &&
      source != null &&
      Boolean(source.constructor.name) &&
      source.constructor.name !== 'Object'
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  protected isNamedFunction(source: unknown): source is Function {
    return typeof source === 'function' && Boolean(source['name']) && source.name !== 'Function';
  }
}
