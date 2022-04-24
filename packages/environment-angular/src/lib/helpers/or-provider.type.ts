import { ProviderToken } from '@angular/core';

/**
 * An object instance or a token that can be used to retrieve an instance from an injector or through a query.
 */
export type OrProvider<T extends object> = T | ProviderToken<T>;
