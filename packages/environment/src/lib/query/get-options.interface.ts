import { NonUndefined } from '../helpers';
import { EnvironmentState, Property } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * Options to get an EnvironmentState property as Observable.
 * @template T The EnvironmentState property type.
 * @template K The expected property target type.
 */
export interface GetOptionsReactive<T extends NonUndefined<Property>, K = T> {
  /**
   * Value to resolve if the EnvironmentState property value is undefined.
   * @template T The EnvironmentState property type.
   */
  defaultValue?: T;

  /**
   * Converts the EnvironmentState property value to the target type.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param value The value of the property at path.
   * @returns The converted value.
   */
  targetType?: (value?: T) => K;

  /**
   * Properties to resolve the EnvironmentState property value interpolation.
   */
  transpile?: EnvironmentState;

  /**
   * Custom EnvironmentQuery config for this operation.
   */
  config?: EnvironmentQueryConfig;
}

/**
 * Options to get an EnvironmentState property as Promise.
 * @template T The EnvironmentState property type.
 * @template K The expected property target type.
 */
export interface GetOptionsAsync<T extends NonUndefined<Property>, K = T> extends GetOptionsReactive<T, K> {
  /**
   * Maximum waiting time in ms before emit undefined.
   */
  dueTime?: number;
}

/**
 * Options to get an EnvironmentState property.
 * @template T The EnvironmentState property type.
 * @template K The expected property target type.
 */
export interface GetOptions<T extends NonUndefined<Property>, K = T> extends GetOptionsReactive<T, K> {
  /**
   * Throws EnvironmentReferenceError if required and the EnvironmentState property doesn't exist.
   */
  required?: boolean;
}

/**
 * The options to get an EnvironmentState property.
 * @template T The EnvironmentState property type.
 * @template K The expected property target type.
 */
export type GetOptionsAll<T extends NonUndefined<Property>, K = T> =
  | GetOptionsReactive<T, K>
  | GetOptionsAsync<T, K>
  | GetOptions<T, K>;
