import { inject, InjectionToken } from '@angular/core';
import { EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { isClass } from '../helpers';

/**
 * The source or list of sources from which to get the environment properties.
 */
export const ENVIRONMENT_SOURCES: InjectionToken<ArrayOrSingle<EnvironmentSource>> = new InjectionToken(
  'ENVIRONMENT_SOURCES'
);

export const ENVIRONMENT_SOURCES_FACTORY: InjectionToken<EnvironmentSource[]> = new InjectionToken(
  'ENVIRONMENT_SOURCES_FACTORY',
  {
    factory: () => {
      const sources: unknown = inject(ENVIRONMENT_SOURCES);
      const sourcesArray: unknown[] = Array.isArray(sources) ? sources : [sources];

      return sourcesArray.map((source: unknown) => (isClass(source) ? inject(source) : source));
    }
  }
);
