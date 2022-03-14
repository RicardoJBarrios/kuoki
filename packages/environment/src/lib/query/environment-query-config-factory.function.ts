import { DeepRequired } from 'ts-essentials';

import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * Returns the environment query configuration with default values for empty parameters.
 * @param config The partial environment query config.
 * @returns The environment query configuration with all default values for empty parameters.
 * @see {@link EnvironmentQueryConfig}
 */
export function environmentQueryConfigFactory<CONFIG extends EnvironmentQueryConfig = EnvironmentQueryConfig>(
  config?: EnvironmentQueryConfig | null
): DeepRequired<CONFIG> {
  return {
    interpolation: config?.interpolation ?? ['{{', '}}'],
    transpileEnvironment: config?.transpileEnvironment ?? false
  } as DeepRequired<CONFIG>;
}
