import { InjectionToken } from '@angular/core';
import { EnvironmentState } from '@kuoki/environment';

export const ENVIRONMENT_INITIAL_VALUE: InjectionToken<EnvironmentState> = new InjectionToken(
  'ENVIRONMENT_INITIAL_VALUE'
);
