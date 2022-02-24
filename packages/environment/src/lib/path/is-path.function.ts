import { Path } from './path.type';

/**
 * Checks if the value is a valid path.
 *
 * A valid path is a property name, a dot-separated set of property names or an array of property names.
 * An environment property name must be a sequence of ASCII characters that can contain letters `a-zA-Z`,
 * `$`, `_`, and digits `0-9`, but may not start with a digit.
 * @param value The value to check.
 * @returns `true` if the value is a valid path, otherwise `false`.
 */
export function isPath(value: unknown): value is Path {
  return isValidComplexKey(value) || isValidArrayKey(value);
}

function isValidComplexKey<T>(value: T): boolean {
  return (
    isValidStringKey(value) ||
    (typeof value === 'string' && value.split('.').every((key: string) => isValidStringKey(key)))
  );
}

function isValidArrayKey<T>(value: T): boolean {
  return Array.isArray(value) && value.length > 0 && value.every((key: T) => isValidStringKey(key));
}

function isValidStringKey(value: unknown): value is string {
  return typeof value == 'string' && /^(?!\d)[\w$]+$/.test(value);
}
