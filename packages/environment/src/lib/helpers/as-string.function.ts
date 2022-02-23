/**
 * Converts any type value to String, stringify objects and methods.
 * @template T The type of the value.
 * @param value The value to convert.
 * @returns The value as string.
 */
export function asString<T>(value: T): string {
  try {
    return typeof value === 'object' ? JSON.stringify(value, asStringReplacer) : String(value);
  } catch {
    return String(value);
  }
}

function asStringReplacer(this: unknown, key: string, value: unknown): unknown {
  if (typeof value === 'function') {
    return value.toString();
  }

  return value;
}
