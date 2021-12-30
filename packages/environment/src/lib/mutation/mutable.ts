import { cloneDeep } from 'lodash-es';
import { Writable } from 'ts-essentials';

/**
 * Returns an environment property object as mutable.
 * @typeParam T The type of the object to mutate.
 * @param property The property.
 * @returns The environment property as mutable.
 */
export function asMutable<T extends object>(property: T): Writable<T> {
  return typeof property === 'object' && property != null ? cloneDeep(property) : property;
}
