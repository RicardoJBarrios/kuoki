/**
 * Configuration parameters for the EnvironmentQuery.
 */
export interface EnvironmentQueryConfig {
  /**
   * The start and end markings for interpolation parameters.
   */
  interpolation?: [string, string];

  /**
   * Use the environment properties to transpile the interpolation.
   */
  transpileEnvironment?: boolean;
}
