import { InjectionToken } from '@angular/core';
import { EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

/**
 * The source or list of sources from which to get the environment properties.
 */
export const ENVIRONMENT_SOURCES: InjectionToken<ArrayOrSingle<EnvironmentSource>> = new InjectionToken(
  'ENVIRONMENT_SOURCES'
);
