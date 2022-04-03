import { EnvironmentSource, InvalidSourceError, isEnvironmentSource, SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';

/**
 * Converts a source to loader source.
 * @param source the source to convert.
 * @returns A loader sources.
 * @throws InvalidSourceError if an environmnet source is invalid.
 * @see {@link InvalidSourceError}
 */
export function loaderSourceFactory(source: EnvironmentSource): LoaderSource {
  if (!isEnvironmentSource(source)) {
    throw new InvalidSourceError(source);
  }

  source.id = source.id ?? randId();
  source.isRequired = source.isRequired ?? false;
  source.isOrdered = source.isOrdered ?? false;
  source.ignoreError = source.ignoreError ?? false;
  source.strategy = source.strategy ?? SourceStrategy.ADD;

  return source as LoaderSource;
}

function randId(): string {
  const radix = 36;

  return Date.now().toString(radix) + Math.random().toString(radix);
}
