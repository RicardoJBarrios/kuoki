import { EnvironmentSource } from '../source';

export type LoaderSource = Omit<Required<EnvironmentSource>, 'path'> & Pick<EnvironmentSource, 'path'>;
