import { InjectionToken } from '@angular/core';
import { EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { OrProvider } from '../helpers';

/**
 * The source or list of sources from which to get the environment properties.
 */
export const ENVIRONMENT_SOURCES: InjectionToken<ArrayOrSingle<OrProvider<EnvironmentSource>>> = new InjectionToken(
  'ENVIRONMENT_SOURCES'
);
