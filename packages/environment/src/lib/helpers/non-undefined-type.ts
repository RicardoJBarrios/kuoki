/**
 * Exclude undefined from T
 */
export type NonUndefined<T> = T extends undefined ? never : T;
