import { Newable } from 'ts-essentials';

/**
 * Check if the value is a Class.
 * @param value The value to check.
 * @returns `true` if the value is a Class, otherwise `false`.
 * @see {@link Type}
 */
export function isClass<T>(value: unknown): value is Newable<T> {
  return typeof value === 'function' && 'prototype' in value && /^\s*class\s+/.test(value.toString());
}
