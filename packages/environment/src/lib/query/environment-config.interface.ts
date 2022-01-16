/**
 * Configuration parameters for the Environment module.
 */
export interface EnvironmentConfig {
  /**
   * The start and end markings for interpolation parameters.
   */
  interpolation?: [string, string];

  /**
   * Use the environment properties to transpile the interpolation.
   */
  transpileEnvironment?: boolean;
}
