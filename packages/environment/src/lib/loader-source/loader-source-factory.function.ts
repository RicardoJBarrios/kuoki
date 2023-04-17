import { EnvironmentSource, InvalidEnvironmentSourceError, isEnvironmentSource, SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';

/**
 * Converts a source to loader source.
 * @param source The EnvironmentSource.
 * @returns A LoaderSource.
 * @throws InvalidSourceError if an environmnet source is invalid.
 */
export function loaderSourceFactory(source: EnvironmentSource): LoaderSource {
  if (!isEnvironmentSource(source)) {
    throw new InvalidEnvironmentSourceError(source);
  }

  source.id = source.id ?? randomId();
  source.isRequired = source.isRequired ?? false;
  source.isOrdered = source.isOrdered ?? false;
  source.ignoreError = source.ignoreError ?? false;
  source.strategy = source.strategy ?? SourceStrategy.ADD;

  return source as LoaderSource;
}

function randomId(): string {
  const radix = 36;

  return Date.now().toString(radix) + Math.random().toString(radix);
}
