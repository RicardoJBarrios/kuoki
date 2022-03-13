import { InjectionToken } from '@angular/core';
import { EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

export const ENVIRONMENT_SOURCES: InjectionToken<ArrayOrSingle<EnvironmentSource>> = new InjectionToken(
  'ENVIRONMENT_SOURCES'
);
