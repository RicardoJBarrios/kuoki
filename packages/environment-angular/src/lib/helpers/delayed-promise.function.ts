export function delayedPromise<T>(value: T, timeout: number): Promise<T> {
  return new Promise((resolve: (value: T | Promise<T>) => void) => setTimeout(() => resolve(value), timeout));
}
