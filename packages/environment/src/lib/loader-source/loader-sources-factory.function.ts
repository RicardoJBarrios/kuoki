import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentSource } from '../source';
import { DuplicatedSourcesError } from './duplicated-sources.error';
import { loaderSourceFactory } from './loader-source-factory.function';
import { LoaderSource } from './loader-source.type';

/**
 * Converts a set of sources to loader sources.
 * @template SOURCE The source used by the implementation.
 * @template LOADER_SOURCE The loader source used by the implementation.
 * @param sources the list of sources to convert.
 * @returns A set of loader sources.
 * @throws InvalidSourceError if an environmnet source is invalid.
 * @throws DuplicatedSourcesError if there are sources with duplicated ids.
 * @see {@link EnvironmentSource}
 * @see {@link LoaderSource}
 * @see {@link InvalidSourceError}
 * @see {@link DuplicatedSourcesError}
 */
export function loaderSourcesFactory<
  SOURCE extends EnvironmentSource = EnvironmentSource,
  LOADER_SOURCE extends LoaderSource = LoaderSource
>(sources?: ArrayOrSingle<SOURCE>): LOADER_SOURCE[] {
  if (sources == null) {
    return [];
  }

  const sourcesArray: SOURCE[] = Array.isArray(sources) ? sources : [sources];

  const loaderSources: LOADER_SOURCE[] = sourcesArray
    .filter((source: SOURCE) => source != null)
    .map((source: SOURCE) => loaderSourceFactory(source));

  checkSourcesIdUniqueness(loaderSources);

  return loaderSources;
}

function checkSourcesIdUniqueness<LOADER_SOURCE extends LoaderSource = LoaderSource>(
  loaderSources: LOADER_SOURCE[]
): LOADER_SOURCE[] {
  const ids: string[] = loaderSources.map((source: LOADER_SOURCE) => source.id);
  const duplicated = ids.filter((item: string, index: number) => ids.indexOf(item) !== index);

  if (duplicated.length > 0) {
    throw new DuplicatedSourcesError(duplicated);
  }

  return loaderSources;
}
