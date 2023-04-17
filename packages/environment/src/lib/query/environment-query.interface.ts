import { Observable } from 'rxjs';

import { AtLeastOne, NonUndefined } from '../helpers';
import { Path } from '../path';
import { EnvironmentState, Property } from '../store';
import { GetOptions, GetOptionsAsync, GetOptionsReactive } from './get-options.interface';

/**
 * Gets the properties from the EnvironmentState.
 */
export abstract class EnvironmentQuery {
  /**
   * Gets all the EnvironmentState properties.
   * @returns All the distinct EnvironmentState properties as Observable.
   */
  abstract getAll$(): Observable<EnvironmentState>;

  /**
   * Gets all the EnvironmentState properties.
   * @returns The first non nil or empty set of EnvironmentState properties as Promise.
   */
  abstract getAllAsync(): Promise<EnvironmentState>;

  /**
   * Gets all the EnvironmentState properties.
   * @returns All the EnvironmentState properties.
   */
  abstract getAll(): EnvironmentState;

  /**
   * Checks if all the EnvironmentState property paths are available for resolution.
   * @param paths The list of EnvironmentState property paths to resolve.
   * @returns distinct `true` as Observable if all the EnvironmentState property paths exists, otherwise `false`.
   */
  abstract containsAll$(...paths: AtLeastOne<Path>): Observable<boolean>;

  /**
   * Checks if all the EnvironmentState property paths are available for resolution.
   * @param paths The list of EnvironmentState property paths to resolve.
   * @returns The first `true` as Promise when all EnvironmentState property paths exists.
   */
  abstract containsAllAsync(...paths: AtLeastOne<Path>): Promise<boolean>;

  /**
   * Checks if all the EnvironmentState property paths are available for resolution.
   * @param paths The list of EnvironmentState property paths to resolve.
   * @returns `true` if all the EnvironmentState property paths exists, otherwise `false`.
   */
  abstract containsAll(...paths: AtLeastOne<Path>): boolean;

  /**
   * Checks if some EnvironmentState property paths are available for resolution.
   * @param paths The list of EnvironmentState property paths to resolve.
   * @returns distinct `true` as Observable if some EnvironmentState property paths exists, otherwise `false`.
   */
  abstract containsSome$(...paths: AtLeastOne<Path>): Observable<boolean>;

  /**
   * Checks if some EnvironmentState property paths are available for resolution.
   * @param paths The list of EnvironmentState property paths to resolve.
   * @returns The first `true` as Promise when some EnvironmentState property paths exists.
   */
  abstract containsSomeAsync(...paths: AtLeastOne<Path>): Promise<boolean>;

  /**
   * Checks if some EnvironmentState property paths are available for resolution.
   * @param paths The list of EnvironmentState property paths to resolve.
   * @returns `true` if some EnvironmentState property paths exists, otherwise `false`.
   */
  abstract containsSome(...paths: AtLeastOne<Path>): boolean;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The converted distinct EnvironmentState property at path as Observable.
   */
  abstract get$<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptionsReactive<T, K> & { targetType: (property?: T) => K }
  ): Observable<K>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The distinct EnvironmentState property at path as Observable.
   */
  abstract get$<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptionsReactive<T, K> & { defaultValue: T }
  ): Observable<T>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The distinct EnvironmentState property at path or undefined as Observable.
   */
  abstract get$<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options?: GetOptionsReactive<T, K>
  ): Observable<T | undefined>;

  abstract get$<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options?: GetOptionsReactive<T, K>
  ): Observable<T | K | undefined>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The first converted non nil EnvironmentState property at path or undefined as Promise.
   */
  abstract getAsync<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptionsAsync<T, K> & { targetType: (property?: T) => K } & { dueTime: number }
  ): Promise<K | undefined>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The first converted non nil EnvironmentState property at path as Promise.
   */
  abstract getAsync<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptionsAsync<T, K> & { targetType: (property?: T) => K }
  ): Promise<K>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The first non nil EnvironmentState property at path or undefined as Promise.
   */
  abstract getAsync<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptionsAsync<T, K> & { dueTime: number }
  ): Promise<T | undefined>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The first non nil EnvironmentState property at path as Promise.
   */
  abstract getAsync<T extends NonUndefined<Property>, K = T>(path: Path, options?: GetOptionsAsync<T, K>): Promise<T>;

  abstract getAsync<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options?: GetOptionsAsync<T, K>
  ): Promise<T | K | undefined>;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The converted EnvironmentState property at path.
   */
  abstract get<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptions<T, K> & { targetType: (property?: T) => K }
  ): K;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The EnvironmentState property at path.
   */
  abstract get<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options: GetOptions<T, K> & ({ defaultValue: T } | { required: true })
  ): T;

  /**
   * Gets the EnvironmentState property value.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param options The options to get a property.
   * @returns The EnvironmentState property at path or undefined.
   */
  abstract get<T extends NonUndefined<Property>, K = T>(path: Path, options?: GetOptions<T, K>): T | undefined;

  abstract get<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options?: GetOptions<T, K> & { required?: boolean }
  ): T | K | undefined;
}
