import { InjectionToken } from '@angular/core';
import { EnvironmentState } from '@kuoki/environment';

/**
 * The initial state for the environment store.
 */
export const ENVIRONMENT_INITIAL_STATE: InjectionToken<EnvironmentState> = new InjectionToken(
  'ENVIRONMENT_INITIAL_STATE'
);
