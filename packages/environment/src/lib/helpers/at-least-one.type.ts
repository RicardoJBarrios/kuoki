/**
 * Type to ensure that an array has at least one element.
 */
export type AtLeastOne<T> = [T, ...T[]];
