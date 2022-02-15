import { EnvironmentSource } from '../source';

/**
 * A source with all the required fiels.
 */
export type LoaderSource = Omit<Required<EnvironmentSource>, 'path'> & Pick<EnvironmentSource, 'path'>;
