/**
 * @internal
 */
export function mergeArraysCustomizer<O, S>(obj: O, source: S): (O | S)[] | undefined {
  if (Array.isArray(obj) && Array.isArray(source)) {
    return obj.concat(source);
  }

  return undefined;
}
