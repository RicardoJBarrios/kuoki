import { ArrayOrSingle } from 'ts-essentials';
import { v4 } from 'uuid';

import { EnvironmentSource, SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';

/**
 * @internal
 */
export function environmentSourcesFactory(sources?: ArrayOrSingle<EnvironmentSource>): LoaderSource[] {
  if (sources == null) {
    return [];
  }

  const sourcesArray: EnvironmentSource[] = Array.isArray(sources) ? sources : [sources];

  return sourcesArray
    .filter((source: EnvironmentSource) => source != null)
    .map((source: EnvironmentSource) => environmentSourceFactory(source));
}

/**
 * @internal
 */
function environmentSourceFactory(source: EnvironmentSource): LoaderSource {
  source.id = source.id ?? v4();
  source.isRequired = source.isRequired ?? false;
  source.isOrdered = source.isOrdered ?? false;
  source.strategy = source.strategy ?? SourceStrategy.ADD;
  source.ignoreError = source.ignoreError ?? false;

  return source as LoaderSource;
}
