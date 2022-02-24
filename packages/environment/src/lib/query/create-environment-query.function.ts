import { EnvironmentStore } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { EnvironmentQuery } from './environment-query.application';

/**
 * Creates an environment query.
 * @param store The environment store.
 * @param config Configuration parameters for the environment query.
 * @returns An environment query instance.
 * @see {@link EnvironmentStore}
 * @see {@link EnvironmentQueryConfig}
 * @see {@link EnvironmentQuery}
 */
export function createEnvironmentQuery(store: EnvironmentStore, config?: EnvironmentQueryConfig): EnvironmentQuery {
  return new EnvironmentQuery(store, config);
}
