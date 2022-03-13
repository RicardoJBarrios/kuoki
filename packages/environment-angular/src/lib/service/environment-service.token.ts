import { InjectionToken } from '@angular/core';
import { EnvironmentService } from '@kuoki/environment';

export const ENVIRONMENT_SERVICE: InjectionToken<EnvironmentService> = new InjectionToken('ENVIRONMENT_SERVICE');
