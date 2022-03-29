import { EnvironmentState, Property } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * The options to get a property.
 * @template T The expected property target type.
 * @template CONFIG The query config used by the implementation.
 * @see {@link EnvironmentQueryConfig}
 */
export interface GetOptions<T, CONFIG extends EnvironmentQueryConfig = EnvironmentQueryConfig> {
  /**
   * The default value to resolve if no value is found.
   */
  defaultValue?: Property;

  /**
   * Converts the returned value.
   * @template T The expected property target type.
   * @param property The value of the property at path.
   * @returns The converted value.
   */
  targetType?: (property: Property) => T;

  /**
   * The properties to resolve the interpolation.
   */
  transpile?: EnvironmentState;

  /**
   * The custom query config for this check.
   * @see {@link EnvironmentQueryConfig}
   */
  config?: CONFIG;

  /**
   * The maximum waiting time before emit undefined.
   * Only used by the Async operation.
   */
  dueTime?: number;
}
