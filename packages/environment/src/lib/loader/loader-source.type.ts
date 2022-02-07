import { Path } from '../path';
import { EnvironmentSource } from '../source';

export type LoaderSource = Required<EnvironmentSource> & { path?: Path };
