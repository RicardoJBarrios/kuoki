import { Type } from '@angular/core';
import {
  DefaultEnvironmentLoader,
  DefaultEnvironmentQuery,
  EnvironmentQueryConfig,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentState,
  EnvironmentStore
} from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { ProviderValue } from '../helpers';

/**
 * Customizes the environment behavior and services.
 */
export interface EnvironmentModuleConfig {
  /**
   * The environment initial state value.
   */
  initialState?: EnvironmentState;
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
  query?: ProviderValue<DefaultEnvironmentQuery>;
  /**
   * The implementation for the environment loader.
   */
  loader?: ProviderValue<DefaultEnvironmentLoader>;
  /**
   * The enviroment sources to load.
   */
  sources?: ArrayOrSingle<EnvironmentSource | Type<EnvironmentSource>>;
  /**
   * Load the required environment sources before application initialization.
   * Default is `true`.
   */
  loadBeforeInit?: boolean;
}

/**
 * Customizes the environment behavior and services for child modules.
 */
export type EnvironmentAngularChildConfig = Pick<EnvironmentModuleConfig, 'loader' | 'sources'>;
