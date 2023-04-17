import { EnvironmentStore } from '../store';
import { DefaultEnvironmentQuery } from './environment-query.application';
import { EnvironmentQuery } from './environment-query.interface';
import { EnvironmentQueryConfig } from './environment-query-config.interface';

/**
 * Creates a DefaultEnvironmentQuery instance.
 * @param store The EnvironmentStore.
 * @param config Configuration parameters for EnvironmentQuery.
 * @returns A DefaultEnvironmentQuery instance.
 */
export function createEnvironmentQuery(store: EnvironmentStore, config?: EnvironmentQueryConfig): EnvironmentQuery {
  return new DefaultEnvironmentQuery(store, config);
}
