export function isPromiseLike<T>(value: any): value is PromiseLike<T> {
  return typeof value?.then === 'function';
}
