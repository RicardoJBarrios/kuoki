/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @internal
 */
export function lifecycleHook<R>(obj: any, method: string, ...args: unknown[]): R | undefined {
  if (typeof obj[method] === 'function') {
    return obj[method](...args);
  }

  return undefined;
}
