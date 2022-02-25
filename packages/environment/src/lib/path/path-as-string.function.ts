import { Path } from './path.type';

/**
 * Converts a Path to string format.
 * @param path The path to convert.
 * @returns The path as string.
 * @see {@link Path}
 */
export function pathAsString(path: Path): string {
  return Array.isArray(path) ? path.join('.') : path;
}
