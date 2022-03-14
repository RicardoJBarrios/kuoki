import { Newable } from 'ts-essentials';

/**
 * A valid Provider value.
 */
export type ProviderValue<T> = T | Newable<T> | (() => T);
