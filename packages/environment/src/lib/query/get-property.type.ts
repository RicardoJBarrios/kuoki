import { Property } from '../store';

/**
 * The return type when getting an environment property.
 * @typeParam T The expected property value type.
 */
export type GetProperty<T> = T | Property | undefined;
