import { EnvironmentSource } from '../source';

/**
 * EnvironmentSource with all the required fiels.
 */
export type LoaderSource = Omit<Required<EnvironmentSource>, 'path' | 'mapFn' | 'errorHandler'> &
  Pick<EnvironmentSource, 'path' | 'mapFn' | 'errorHandler'>;
