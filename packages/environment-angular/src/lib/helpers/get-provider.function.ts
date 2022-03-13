import { InjectionToken, Provider } from '@angular/core';

import { isType } from './is-type';

/**
 * Creates a suitable Provider object using a config value and a default value.
 * @param provide The service to provide.
 * @param configValue The provider value from the config.
 * @param defaultValue The default provider value to use if `defaultValue` is nil.
 * @param deps The Provider required dependencies.
 * @returns A suitable Provider.
 */
export function getProvider(provide: unknown, configValue: unknown, defaultValue: unknown, deps?: unknown[]): Provider {
  const providerValue: unknown = configValue ?? defaultValue;

  if (providerValue instanceof InjectionToken) {
    return { provide, useExisting: providerValue, deps };
  }

  if (isType(providerValue)) {
    return { provide, useClass: providerValue, deps };
  }

  if (typeof providerValue === 'function') {
    return { provide, useFactory: providerValue, deps };
  }

  return { provide, useValue: providerValue, deps };
}
