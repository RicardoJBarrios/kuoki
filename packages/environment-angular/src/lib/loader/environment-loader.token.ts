import { InjectionToken } from '@angular/core';
import { EnvironmentLoader } from '@kuoki/environment';

export const ENVIRONMENT_LOADER: InjectionToken<EnvironmentLoader> = new InjectionToken('ENVIRONMENT_LOADER');
