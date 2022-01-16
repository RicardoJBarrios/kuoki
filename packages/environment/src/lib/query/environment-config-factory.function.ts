import { EnvironmentConfig } from './environment-config.interface';

/**
 * Returns the environment configuration with all default values for the Environment module.
 * @param config The partial environment config.
 * @returns The environment configuration with all default values.
 * @example
 * ```js
 * environmentConfigFactory();
 * // {interpolation:['{{','}}'],transpileEnvironment:false}
 * environmentConfigFactory({ interpolation: ['(', ')'] });
 * // {interpolation:['(',')'],transpileEnvironment:false}
 * environmentConfigFactory({ transpileEnvironment: true });
 * // {interpolation:['{{','}}'],transpileEnvironment:true}
 * ```
 */
export function environmentConfigFactory(config?: EnvironmentConfig): Required<EnvironmentConfig> {
  return {
    interpolation: config?.interpolation ?? ['{{', '}}'],
    transpileEnvironment: config?.transpileEnvironment ?? false,
  };
}
