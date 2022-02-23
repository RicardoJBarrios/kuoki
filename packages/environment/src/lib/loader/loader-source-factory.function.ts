import { v4 } from 'uuid';

import { EnvironmentSource, InvalidEnvironmentSourceError, isEnvironmentSource, SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';

/**
 * Converts a source to loader source.
 * @template SOURCE an EnvironmentSource or extension.
 * @template LOADER_SOURCE a LoaderSource or extension.
 * @param source the source to convert.
 * @returns A loader sources.
 * @throws If an environmnet source is invalid.
 */
export function loaderSourceFactory<
  SOURCE extends EnvironmentSource = EnvironmentSource,
  LOADER_SOURCE extends LoaderSource = LoaderSource
>(source: SOURCE): LOADER_SOURCE {
  if (!isEnvironmentSource(source)) {
    throw new InvalidEnvironmentSourceError(source);
  }

  source.id = source.id ?? v4();
  source.isRequired = source.isRequired ?? false;
  source.isOrdered = source.isOrdered ?? false;
  source.ignoreError = source.ignoreError ?? false;
  source.strategy = source.strategy ?? SourceStrategy.ADD;

  return source as LOADER_SOURCE;
}
