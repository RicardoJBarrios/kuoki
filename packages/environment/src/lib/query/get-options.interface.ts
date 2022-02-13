import { EnvironmentState, Property } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * The options to get a property.
 * @typeParam T The expected property value type.
 */
export interface GetOptions<T> extends EnvironmentQueryConfig {
  /**
   * The default value to resolve if no value is found.
   */
  defaultValue?: Property;
  /**
   * Converts the returned value.
   * @param property The value of the property at path.
   * @returns The converted value.
   */
  targetType?: (property: Property) => T;
  /**
   * The properties to resolve the interpolation.
   */
  transpile?: EnvironmentState;
}
