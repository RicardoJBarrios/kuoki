import {
  EnvironmentLoader,
  EnvironmentQuery,
  EnvironmentQueryConfig,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentState,
  EnvironmentStore
} from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { ProviderValue } from './provider-value.type';

/**
 * Customizes the environment behavior and services.
 */
export interface EnvironmentModuleConfig {
  /**
   * The environment initial value.
   */
  initialValue?: EnvironmentState;
  /**
   * The implementation for the environment store.
   */
  store?: ProviderValue<EnvironmentStore>;
  /**
   * The implementation for the environment service.
   */
  service?: ProviderValue<EnvironmentService>;
  /**
   * The environment query config values.
   */
  queryConfig?: EnvironmentQueryConfig;
  /**
   * The implementation for the environment query.
   */
  query?: ProviderValue<EnvironmentQuery>;
  /**
   * The implementation for the environment loader.
   */
  loader?: ProviderValue<EnvironmentLoader>;
  /**
   * The enviroment sources to load.
   */
  sources?: ArrayOrSingle<ProviderValue<EnvironmentSource>>;
  /**
   * Load the required environment sources before application initialization. Default is `true`.
   */
  loadBeforeInit?: boolean;
}

/**
 * Customizes the environment behavior and services for child modules.
 */
export type EnvironmentAngularChildConfig = Pick<EnvironmentModuleConfig, 'loader' | 'sources'>;
