import { ArrayOrSingle } from 'ts-essentials';

import { createEnvironmentLoader, EnvironmentLoader } from '../loader';
import { createEnvironmentQuery, EnvironmentQuery } from '../query';
import { createEnvironmentService, EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { createEnvironmentStore, EnvironmentStore } from '../store';
import { EnvironmentModule } from './environment-module.interface';

/**
 * Creates an EnvironmentModule with all the default implementations and starts the load of properties.
 * @param sources The list of EnvironmentSources.
 * @returns An EnvironmentModule as Promise with all the default implementations.
 */
export async function createEnvironmentModule(sources?: ArrayOrSingle<EnvironmentSource>): Promise<EnvironmentModule> {
  const store: EnvironmentStore = createEnvironmentStore();
  const service: EnvironmentService = createEnvironmentService(store);
  const query: EnvironmentQuery = createEnvironmentQuery(store);
  const loader: EnvironmentLoader = createEnvironmentLoader(service, sources);

  await loader.load();

  return Promise.resolve({ store, service, query, loader });
}
