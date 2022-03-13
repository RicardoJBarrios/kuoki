import { InjectionToken } from '@angular/core';
import { EnvironmentStore } from '@kuoki/environment';

export const ENVIRONMENT_STORE: InjectionToken<EnvironmentStore> = new InjectionToken('ENVIRONMENT_STORE');
