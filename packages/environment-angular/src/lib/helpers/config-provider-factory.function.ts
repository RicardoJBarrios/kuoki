import { InjectionToken, Provider } from '@angular/core';

import { isClass } from './is-class';

/**
 * Creates a suitable Provider object using a config value and a default value.
 * @param value The provider values.
 * @returns A suitable Provider.
 */
export function configProviderFactory(value: {
  provide: unknown;
  defaultValue: unknown;
  configValue?: unknown;
  deps?: unknown[];
  multi?: boolean;
}): Provider {
  const providerValue: unknown = value.configValue ?? value.defaultValue;

  if (providerValue instanceof InjectionToken) {
    return { provide: value.provide, useExisting: providerValue, deps: value.deps, multi: value.multi };
  }

  if (isClass(providerValue)) {
    return { provide: value.provide, useClass: providerValue, deps: value.deps, multi: value.multi };
  }

  if (typeof providerValue === 'function') {
    return { provide: value.provide, useFactory: providerValue, deps: value.deps, multi: value.multi };
  }

  return { provide: value.provide, useValue: providerValue, deps: value.deps, multi: value.multi };
}
