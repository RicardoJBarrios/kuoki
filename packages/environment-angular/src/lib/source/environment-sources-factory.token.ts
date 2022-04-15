import { inject, InjectionToken } from '@angular/core';
import { EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { isClass, OrType } from '../helpers';
import { ENVIRONMENT_SOURCES } from './environment-sources.token';

export const ENVIRONMENT_SOURCES_FACTORY: InjectionToken<EnvironmentSource[]> = new InjectionToken(
  'ENVIRONMENT_SOURCES_FACTORY',
  {
    factory: () => {
      const sources: ArrayOrSingle<OrType<EnvironmentSource>> | null = inject(ENVIRONMENT_SOURCES);

      if (sources == null) {
        return null;
      }

      const arraySources: OrType<EnvironmentSource>[] = Array.isArray(sources) ? sources : [sources];
      const sourceObjects: EnvironmentSource[] = arraySources
        .map((source: OrType<EnvironmentSource>) => (isClass(source) ? inject(source) : source))
        .filter((source: EnvironmentSource | null) => source != null);

      if (sourceObjects.length === 0) {
        return null;
      }

      return sourceObjects.length === 1 ? sourceObjects[0] : sourceObjects;
    }
  }
);
