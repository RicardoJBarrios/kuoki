/**
 * Converts any type value to String, stringify objects.
 * @typeParam T The type of the value.
 * @param value The value to convert.
 * @returns The value as string.
 */
export function asString<T>(value: T): string {
  try {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  } catch {
    return String(value);
  }
}
