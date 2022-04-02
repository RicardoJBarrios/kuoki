import { EnvironmentStore } from '../store';
import { DefaultEnvironmentService } from './environment-service.application';
import { EnvironmentService } from './environment-service.gateway';

/**
 * Creates a default environment service instance.
 * @param store The environment store.
 * @returns A default environment service instance.
 */
export function createEnvironmentService(store: EnvironmentStore): EnvironmentService {
  return new DefaultEnvironmentService(store);
}
