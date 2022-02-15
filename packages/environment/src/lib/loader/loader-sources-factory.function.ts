import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentSource } from '../source';
import { loaderSourceFactory } from './loader-source-factory.function';
import { LoaderSource } from './loader-source.type';

/**
 * Converts a set of sources to loader sources.
 * @template SOURCE an EnvironmentSource or extension.
 * @template LOADER_SOURCE a LoaderSource or extension.
 * @param sources the list of sources to convert.
 * @returns A set of loader sources.
 */
export function loaderSourcesFactory<
  SOURCE extends EnvironmentSource = EnvironmentSource,
  LOADER_SOURCE extends LoaderSource = LoaderSource
>(sources?: ArrayOrSingle<SOURCE>): LOADER_SOURCE[] {
  if (sources == null) {
    return [];
  }

  const sourcesArray: SOURCE[] = Array.isArray(sources) ? sources : [sources];

  return sourcesArray.filter((source: SOURCE) => source != null).map((source: SOURCE) => loaderSourceFactory(source));
}
