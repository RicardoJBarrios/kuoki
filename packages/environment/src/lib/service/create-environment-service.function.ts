import { EnvironmentStore } from '../store';
import { DefaultEnvironmentService } from './environment-service.application';
import { EnvironmentService } from './environment-service.interface';

/**
 * Creates a DefaultEnvironmentService instance.
 * @param store The EnvironmentStore.
 * @returns A DefaultEnvironmentService instance.
 */
export function createEnvironmentService(store: EnvironmentStore): EnvironmentService {
  return new DefaultEnvironmentService(store);
}
