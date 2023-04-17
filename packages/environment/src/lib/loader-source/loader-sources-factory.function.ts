import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentSource } from '../source';
import { DuplicatedEnvironmentSourcesError } from './duplicated-environment-sources.error';
import { LoaderSource } from './loader-source.type';
import { loaderSourceFactory } from './loader-source-factory.function';

/**
 * Converts a set of EnvironmentSources to LoaderSource.
 * @param sources The list of EnvironmentSources.
 * @returns A set of LoaderSource.
 * @throws InvalidSourceError if an environmnet source is invalid.
 * @throws DuplicatedSourcesError if there are sources with duplicated ids.
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
    throw new DuplicatedEnvironmentSourcesError(duplicated);
  }

  return loaderSources;
}
