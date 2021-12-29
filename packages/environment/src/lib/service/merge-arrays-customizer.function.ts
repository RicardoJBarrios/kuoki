import { Property } from '../store';

/**
 * Merges object and source Array.
 * @param obj The object to merge.
 * @param source The source to merge.
 * @returns The merged Array or `undefined` if `obj` or `source` are not Array.
 */
export function mergeArraysCustomizer(obj: Property, source: Property): Property | undefined {
  if (Array.isArray(obj) && Array.isArray(source)) {
    return obj.concat(source);
  }

  return undefined;
}
