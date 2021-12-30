import { Property } from '../store';
import { Path } from './path.type';

/**
 * Checks if the value is a valid path.
 *
 * A valid path is a property name, a dot-separated set of property names or an array of property names.
 * A property name must be a sequence of ASCII characters that can contain letters (a-zA-Z),
 * `$`, `_`, and digits (0-9), but may not start with a digit.
 * @param value The value to check.
 * @returns `true` if the value is a valid path, `false` otherwise.
 * @example
 * ```js
 * isValidPath('a.a'); // true
 * isValidPath(['2a', 'a']); // false
 * ```
 */
export function isValidPath(value: Property): value is Path {
  return isValidComplexKey(value) || isValidArrayKey(value);
}

function isValidComplexKey(value: Property): boolean {
  return (
    isValidStringKey(value) ||
    (typeof value === 'string' && (value as string).split('.').every((key: string) => isValidStringKey(key)))
  );
}

function isValidArrayKey(value: Property): boolean {
  return Array.isArray(value) && value.length > 0 && value.every((key: unknown) => isValidStringKey(key));
}

function isValidStringKey(value: unknown): value is string {
  return typeof value == 'string' && /^(?!\d)[\w$]+$/.test(value);
}
