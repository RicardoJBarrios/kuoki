import { pathAsArray } from './path-as-array.function';
import { pathAsString } from './path-as-string.function';
import { Path } from './path.type';

export function prefixPath(path: Path, prefix: Path): Path {
  const arrayPath: Path = pathAsArray(path);
  const arrayPrefix: Path = pathAsArray(prefix);
  const final = [...arrayPrefix, ...arrayPath];

  return Array.isArray(path) ? final : pathAsString(final);
}
