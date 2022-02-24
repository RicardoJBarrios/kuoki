import { EnvironmentState, Property } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * The options to get a property.
 * @template T The expected property target type.
 */
export interface GetOptions<T> extends EnvironmentQueryConfig {
  /**
   * The default value to resolve if no value is found.
   * @see {@link Property}
   */
  defaultValue?: Property;

  /**
   * Converts the returned value.
   * @template T The expected property target type.
   * @param property The value of the property at path.
   * @returns The converted value.
   * @see {@link Property}
   */
  targetType?: (property: Property) => T;

  /**
   * The properties to resolve the interpolation.
   * @see {@link EnvironmentState}
   */
  transpile?: EnvironmentState;
}
