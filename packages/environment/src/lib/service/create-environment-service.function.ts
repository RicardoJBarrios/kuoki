import { EnvironmentStore } from '../store';
import { EnvironmentService } from './environment-service.application';

/**
 * Creates an EnvironmentService.
 * @param store The environment store.
 * @returns An EnvironmentService instance.
 * @see {@link EnvironmentService}
 */
export function createEnvironmentService(store: EnvironmentStore): EnvironmentService {
  return new EnvironmentService(store);
}
