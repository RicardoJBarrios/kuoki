import { Path } from './path.type';

/**
 * Converts a Path to string format.
 * @param path The path to convert.
 * @returns The path as string.
 * @example
 * ```js
 * pathAsString('a.b'); // 'a.b'
 * pathAsString(['a','b']); // 'a.b'
 * ```
 */
export function pathAsString(path: Path): string {
  return Array.isArray(path) ? path.join('.') : path;
}
