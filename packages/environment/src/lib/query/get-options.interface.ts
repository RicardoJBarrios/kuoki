import { EnvironmentState, Property } from '../store';
import { EnvironmentConfig } from './environment-config.interface';

/**
 * The options to get a property.
 */
export interface GetOptions<T = unknown> extends EnvironmentConfig {
  /**
   * The default value to resolve if no value is found.
   */
  defaultValue?: Property;
  /**
   * The expected type converter function.
   */
  targetType?: (property: Property) => T;
  /**
   * The properties to resolve the interpolation.
   */
  transpile?: EnvironmentState;
}
