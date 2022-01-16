import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * Returns the environment query configuration with default values for empty parameters.
 *
 * The default {@link EnvironmentQueryConfig} value is `{ interpolation: ['{{', '}}'], transpileEnvironment: false }`.
 * @param config The partial environment query config.
 * @returns The environment query configuration with all default values for empty parameters.
 * @example
 * ```js
 * environmentQueryConfigFactory();
 * // {interpolation:['{{','}}'],transpileEnvironment:false}
 * environmentQueryConfigFactory({ interpolation: ['(', ')'] });
 * // {interpolation:['(',')'],transpileEnvironment:false}
 * environmentQueryConfigFactory({ transpileEnvironment: true });
 * // {interpolation:['{{','}}'],transpileEnvironment:true}
 * ```
 */
export function environmentQueryConfigFactory(config?: EnvironmentQueryConfig): Required<EnvironmentQueryConfig> {
  return {
    interpolation: config?.interpolation ?? ['{{', '}}'],
    transpileEnvironment: config?.transpileEnvironment ?? false,
  };
}