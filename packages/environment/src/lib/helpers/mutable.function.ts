import { cloneDeep } from 'lodash-es';
import { Writable } from 'ts-essentials';

/**
 * Returns the object value as mutable.
 * @typeParam T The type of the object value.
 * @param value The object value.
 * @returns The object value as mutable.
 */
export function mutable<T extends object>(value: T): Writable<T>;
/**
 * Returns the value.
 * @typeParam T The type of the value.
 * @param value The value.
 * @returns The value.
 */
export function mutable<T>(value: T): T;
export function mutable<T>(value: T): Writable<T> | T {
  return typeof value === 'object' ? cloneDeep(value) : value;
}
