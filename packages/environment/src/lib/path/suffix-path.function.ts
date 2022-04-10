import { pathAsArray } from './path-as-array.function';
import { pathAsString } from './path-as-string.function';
import { Path } from './path.type';

/**
 * Adds a suffix to a path.
 * @param path The original path.
 * @param suffix The path suffix.
 * @returns The suffixed path in the original format.
 */
export function suffixPath(path: Path, suffix: Path): Path {
  const arrayPath: Path = pathAsArray(path);
  const arraySuffix: Path = pathAsArray(suffix);
  const final = [...arrayPath, ...arraySuffix];

  return Array.isArray(path) ? final : pathAsString(final);
}
