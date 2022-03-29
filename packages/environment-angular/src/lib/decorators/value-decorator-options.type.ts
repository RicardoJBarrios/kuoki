import { EnvironmentQueryConfig, GetOptions } from '@kuoki/environment';

/**
 * The options to get the value.
 */
export interface ValueDecoratorOptions<T, CONFIG extends EnvironmentQueryConfig = EnvironmentQueryConfig>
  extends GetOptions<T, CONFIG> {
  /**
   * Defines if the value must be queried to the environment in every getter
   * or stored as static after the fist query and every time is set to undefined again.
   * Defaults to `true`.
   */
  static?: boolean;
}
