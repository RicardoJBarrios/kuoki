/**
 * Executes a lifecycle hook if is implemented.
 * @template T The expected return type.
 * @param obj The source object.
 * @param method The lifecycle hook method name.
 * @param args The args required by the lifecycle hook.
 * @returns The resulf of the lifecycle hook execution.
 */
export function lifecycleHook<T>(obj: any, method: string, ...args: unknown[]): T | undefined {
  if (typeof obj[method] === 'function') {
    return obj[method](...args);
  }

  return undefined;
}
