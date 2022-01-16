import { Path } from './path.type';

/**
 * Converts a Path to Array format.
 * @param path The path to convert.
 * @returns The path as Array.
 * @example
 * ```js
 * pathAsArray('a.b'); // ['a','b']
 * pathAsArray(['a','b']); // ['a','b']
 * ```
 */
export function pathAsArray(path: Path): string[] {
  return Array.isArray(path) ? path : path.split('.');
}
