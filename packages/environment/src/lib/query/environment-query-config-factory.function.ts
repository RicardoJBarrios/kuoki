import { DeepRequired } from 'ts-essentials';

import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * Returns the environment query configuration with default values for empty parameters.
 * @param config The partial environment query config.
 * @returns The environment query configuration with all default values for empty parameters.
 */
export function environmentQueryConfigFactory(
  config?: EnvironmentQueryConfig | null
): DeepRequired<EnvironmentQueryConfig> {
  return {
    interpolation: ['{{', '}}'],
    transpileEnvironment: false,
    ...config
  } as DeepRequired<EnvironmentQueryConfig>;
}
