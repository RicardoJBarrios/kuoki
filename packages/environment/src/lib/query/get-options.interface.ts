import { EnvironmentState, Property } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * The options to get a property as Observable.
 */
export interface GetOptionsObs<T extends Property, K = T> {
  /**
   * The default value to resolve if value is undefined.
   * @template T The property type.
   */
  defaultValue?: T;

  /**
   * Converts the returned value to the target type.
   * @template T The property type.
   * @template K The expected property target type.
   * @param value The value of the property at path.
   * @returns The converted value.
   */
  targetType?: (value?: T) => K;

  /**
   * Properties to resolve the interpolation.
   */
  transpile?: EnvironmentState;

  /**
   * Custom query config for this operation.
   */
  config?: EnvironmentQueryConfig;
}

/**
 * The options to get a property as Promise.
 */
export interface GetOptionsAsync<T extends Property, K = T> extends GetOptionsObs<T, K> {
  /**
   * The maximum waiting time before emit undefined.
   */
  dueTime?: number;
}

/**
 * The options to get a property.
 */
export interface GetOptions<T extends Property, K = T> extends GetOptionsObs<T, K> {
  /**
   * If true, the query throws error if the property doesn't exist.
   */
  required?: boolean;
}

/**
 * The options to get a property.
 */
export type GetOptionsAll<T extends Property, K = T> = GetOptionsObs<T, K> | GetOptionsAsync<T, K> | GetOptions<T, K>;
