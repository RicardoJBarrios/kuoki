import { EnvironmentStore } from '../store';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { EnvironmentQuery } from './environment-query.application';

/**
 * Creates an EnvironmentQuery.
 * @param store The environment store.
 * @param config Configuration parameters for the EnvironmentQuery.
 * @returns An EnvironmentQuery instance.
 * @see {@link EnvironmentQuery}
 */
export function createEnvironmentQuery(store: EnvironmentStore, config?: EnvironmentQueryConfig): EnvironmentQuery {
  return new EnvironmentQuery(store, config);
}
