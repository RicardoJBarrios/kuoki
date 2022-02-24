/**
 * Evaluates a check if the value is defined.
 * @param value The value to check.
 * @param check The check operation.
 * @returns The check result or `true` if the value is nil.
 */
export function ifDefined(value: unknown, check: boolean): boolean {
  return value != null ? check : true;
}
