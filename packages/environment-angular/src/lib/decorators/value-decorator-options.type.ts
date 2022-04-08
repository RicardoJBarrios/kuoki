import { GetOptions } from '@kuoki/environment';

/**
 * The options to get the value and set the property.
 */
export interface ValueDecoratorOptions<T> extends GetOptions<T> {
  /**
   * Defines if the value must be queried to the environment in every getter
   * or stored as static after the fist query and every time is set to undefined again.
   * Defaults to `true`.
   */
  static?: boolean;
  /**
   * Defines if this property shows up during enumeration of the properties on the corresponding object.
   * Defaults to `true`.
   */
  enumerable?: boolean;
  /**
   * Defines if the type of this property descriptor may be changed and if the property may be deleted
   * from the corresponding object. Defaults to `true`.
   */
  configurable?: boolean;
}
