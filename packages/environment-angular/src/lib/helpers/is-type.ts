import { Type } from '@angular/core';

/**
 * Check if the value is a valid Type.
 * @param value The value to check.
 * @returns `true` if the value is a Type, otherwise `false`.
 * @see {@link Type}
 */
export function isType<T>(value: unknown): value is Type<T> {
  return typeof value === 'function' && 'prototype' in value && /^\s*class\s+/.test(value.toString());
}
