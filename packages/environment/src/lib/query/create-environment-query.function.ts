import { EnvironmentStore } from '../store';
import { DefaultEnvironmentQuery } from './environment-query.application';
import { EnvironmentQuery } from './environment-query.interface';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * Creates a default environment query instance.
 * @param store The environment store.
 * @param config Configuration parameters for the environment query.
 * @returns A default environment query instance.
 */
export function createEnvironmentQuery(store: EnvironmentStore, config?: EnvironmentQueryConfig): EnvironmentQuery {
  return new DefaultEnvironmentQuery(store, config);
}
