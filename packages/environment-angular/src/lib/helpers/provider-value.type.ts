import { Type } from '@angular/core';

/**
 * A valid Provider value.
 */
export type ProviderValue<T> = T | Type<T> | (() => T);
