import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentSource } from '../source';
import { DuplicatedSourcesError } from './duplicated-sources.error';
import { LoaderSource } from './loader-source.type';
import { loaderSourceFactory } from './loader-source-factory.function';

/**
 * Converts a set of sources to loader sources.
 * @param sources the list of sources to convert.
 * @returns A set of loader sources.
 * @throws InvalidSourceError if an environmnet source is invalid.
 * @throws DuplicatedSourcesError if there are sources with duplicated ids.
 * @see {@link InvalidSourceError}
 * @see {@link DuplicatedSourcesError}
 */
export function loaderSourcesFactory(sources?: ArrayOrSingle<EnvironmentSource> | null): LoaderSource[] {
  if (sources == null) {
    return [];
  }

  const sourcesArray: EnvironmentSource[] = Array.isArray(sources) ? sources : [sources];

  const loaderSources: LoaderSource[] = sourcesArray
    .filter((source: EnvironmentSource) => source != null)
    .map((source: EnvironmentSource) => loaderSourceFactory(source));

  checkSourcesIdUniqueness(loaderSources);

  return loaderSources;
}

function checkSourcesIdUniqueness(loaderSources: LoaderSource[]): LoaderSource[] {
  const ids: string[] = loaderSources.map((source: LoaderSource) => source.id);
  const duplicated = ids.filter((item: string, index: number) => ids.indexOf(item) !== index);

  if (duplicated.length > 0) {
    throw new DuplicatedSourcesError(duplicated);
  }

  return loaderSources;
}
