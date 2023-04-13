import { inject, InjectionToken } from '@angular/core';
import { EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { isClass, OrProvider } from '../helpers';
import { ENVIRONMENT_SOURCES } from './environment-sources.token';

/**
 * The environment sources as single injected source or array of injected sources.
 */
export const ENVIRONMENT_SOURCES_FACTORY: InjectionToken<EnvironmentSource[]> = new InjectionToken(
  'ENVIRONMENT_SOURCES_FACTORY',
  {
    factory: () => {
      const sources: ArrayOrSingle<OrProvider<EnvironmentSource>> | null = inject(ENVIRONMENT_SOURCES, {
        optional: true
      });

      if (!Array.isArray(sources)) {
        return sources;
      }

      const sourceObjects: EnvironmentSource[] = sources
        .map((source: OrProvider<EnvironmentSource>) => (isClass(source) ? inject(source) : source))
        .map((source: OrProvider<EnvironmentSource>) => source as EnvironmentSource)
        .filter((source: EnvironmentSource) => source != null);

      if (sourceObjects.length === 0) {
        return null;
      }

      return sourceObjects.length === 1 ? sourceObjects[0] : sourceObjects;
    }
  }
);
