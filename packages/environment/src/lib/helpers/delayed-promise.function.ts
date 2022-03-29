/**
 * Creates a promise that resolves the value on due time.
 * @param value The value to resolve.
 * @param dueTime The time to wait to resolve the Promise.
 * @returns A delayed Promise.
 */
export function delayedPromise<T>(value: T, dueTime: number): Promise<T> {
  return new Promise((resolve: (value: T | Promise<T>) => void) => setTimeout(() => resolve(value), dueTime));
}
