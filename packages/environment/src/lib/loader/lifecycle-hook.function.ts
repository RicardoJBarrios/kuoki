/**
 * Executes a lifecycle hook if is implemented.
 * @param obj The source object.
 * @param method The lifecycle hook method name.
 * @param args The args required by the lifecycle hook.
 * @returns The resulf of the lifecycle hook execution.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lifecycleHook<R>(obj: any, method: string, ...args: unknown[]): R | undefined {
  if (typeof obj[method] === 'function') {
    return obj[method](...args);
  }

  return undefined;
}
