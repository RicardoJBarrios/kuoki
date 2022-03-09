import { EnvironmentStore } from '../store';
import { EnvironmentService } from './environment-service.application';

/**
 * Creates an environment service.
 * @param store The environment store.
 * @returns An environment service instance.
 */
export function createEnvironmentService(store: EnvironmentStore): EnvironmentService {
  return new EnvironmentService(store);
}
