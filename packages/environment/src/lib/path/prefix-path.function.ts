import { Path } from './path.type';
import { pathAsArray } from './path-as-array.function';
import { pathAsString } from './path-as-string.function';

/**
 * Adds a prefix to a path.
 * @param path The original path.
 * @param prefix The path prefix.
 * @returns The prefixed path in the original format.
 */
export function prefixPath(path: Path, prefix: Path): Path {
  const arrayPath: Path = pathAsArray(path);
  const arrayPrefix: Path = pathAsArray(prefix);
  const final = [...arrayPrefix, ...arrayPath];

  return Array.isArray(path) ? final : pathAsString(final);
}
