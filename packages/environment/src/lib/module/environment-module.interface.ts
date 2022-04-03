import { EnvironmentLoader } from '../loader';
import { EnvironmentQuery } from '../query';
import { EnvironmentService } from '../service';
import { EnvironmentStore } from '../store';

/**
 * An environment object with all the implemented services.
 */
export interface EnvironmentModule {
  store: EnvironmentStore;
  service: EnvironmentService;
  query: EnvironmentQuery;
  loader: EnvironmentLoader;
}
