import { Property } from '../store';

/**
 * The return type when getting an environment property.
 * @template T The expected property value type.
 */
export type GetProperty<T> = T | Property | undefined;
