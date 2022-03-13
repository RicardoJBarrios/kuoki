import { InjectionToken } from '@angular/core';
import { EnvironmentQueryConfig } from '@kuoki/environment';

export const ENVIRONMENT_QUERY_CONFIG: InjectionToken<EnvironmentQueryConfig> = new InjectionToken(
  'ENVIRONMENT_QUERY_CONFIG'
);
