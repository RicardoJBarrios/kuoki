import { v4 } from 'uuid';

import { EnvironmentSource, InvalidSourceError, isEnvironmentSource, SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';

/**
 * Converts a source to loader source.
 * @template SOURCE The source used by the implementation.
 * @template LOADER_SOURCE The loader source used by the implementation.
 * @param source the source to convert.
 * @returns A loader sources.
 * @throws InvalidSourceError if an environmnet source is invalid.
 * @see {@link EnvironmentSource}
 * @see {@link LoaderSource}
 * @see {@link InvalidSourceError}
 */
export function loaderSourceFactory<
  SOURCE extends EnvironmentSource = EnvironmentSource,
  LOADER_SOURCE extends LoaderSource = LoaderSource
>(source: SOURCE): LOADER_SOURCE {
  if (!isEnvironmentSource(source)) {
    throw new InvalidSourceError(source);
  }

  source.id = source.id ?? v4();
  source.isRequired = source.isRequired ?? false;
  source.isOrdered = source.isOrdered ?? false;
  source.ignoreError = source.ignoreError ?? false;
  source.strategy = source.strategy ?? SourceStrategy.ADD;

  return source as LOADER_SOURCE;
}
