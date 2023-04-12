import { Observable } from 'rxjs';

import { AtLeastOne } from '../helpers';
import { Path } from '../path';
import { EnvironmentState, Property } from '../store';
import { GetOptions, GetOptionsAsync, GetOptionsObs } from './get-options.interface';

/**
 * Gets the properties from the environment.
 */
export abstract class EnvironmentQuery {
  /**
   * Gets all the environment properties.
   * @returns All the distinct environment properties as Observable.
   */
  abstract getAll$(): Observable<EnvironmentState>;

  /**
   * Gets all the environment properties.
   * @returns The first non nil or empty set of environment properties as Promise.
   */
  abstract getAllAsync(): Promise<EnvironmentState>;

  /**
   * Gets all the environment properties.
   * @returns All the environment properties.
   */
  abstract getAll(): EnvironmentState;

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns distinct `true` as Observable if all the environment property paths exists, otherwise `false`.
   */
  abstract containsAll$(...paths: AtLeastOne<Path>): Observable<boolean>;

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The property path to resolve.
   * @returns The first `true` as Promise when all environment property paths exists.
   */
  abstract containsAllAsync(...paths: AtLeastOne<Path>): Promise<boolean>;

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns `true` if all the environment property paths exists, otherwise `false`.
   */
  abstract containsAll(...paths: AtLeastOne<Path>): boolean;

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns distinct `true` as Observable if some environment property paths exists, otherwise `false`.
   */
  abstract containsSome$(...paths: AtLeastOne<Path>): Observable<boolean>;

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The property path to resolve.
   * @returns The first `true` as Promise when some environment property paths exists.
   */
  abstract containsSomeAsync(...paths: AtLeastOne<Path>): Promise<boolean>;

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns `true` if some environment property paths exists, otherwise `false`.
   */
  abstract containsSome(...paths: AtLeastOne<Path>): boolean;

  /**
   * Gets the environment property at path.
   * @template T The expected return type.
   * @template K The expected property target type.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The distinct environment property at path as Observable.
   */
  abstract get$<T extends Property, K = T>(
    path: Path,
    options: GetOptionsObs<T, K> & { targetType: (property?: T) => K }
  ): Observable<K>;
  abstract get$<T extends Property, K = T>(
    path: Path,
    options: GetOptionsObs<T, K> & { defaultValue: T }
  ): Observable<T>;
  abstract get$<T extends Property, K = T>(path: Path, options?: GetOptionsObs<T, K>): Observable<T | undefined>;

  abstract get$<T extends Property, K = T>(path: Path, options?: GetOptionsObs<T, K>): Observable<T | K | undefined>;

  /**
   * Gets the environment property at path.
   * @template T The expected return type.
   * @template K The expected property target type.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The first non nil environment property at path as Promise.
   */

  abstract getAsync<T extends Property, K = T>(
    path: Path,
    options: GetOptionsAsync<T, K> & { targetType: (property?: T) => K } & { dueTime: number }
  ): Promise<K | undefined>;
  abstract getAsync<T extends Property, K = T>(
    path: Path,
    options: GetOptionsAsync<T, K> & { targetType: (property?: T) => K }
  ): Promise<K>;
  abstract getAsync<T extends Property, K = T>(
    path: Path,
    options: GetOptionsAsync<T, K> & { dueTime: number }
  ): Promise<T | undefined>;
  abstract getAsync<T extends Property, K = T>(path: Path, options?: GetOptionsAsync<T, K>): Promise<T>;

  abstract getAsync<T extends Property, K = T>(path: Path, options?: GetOptionsAsync<T, K>): Promise<T | K | undefined>;

  /**
   * Gets the environment property at path.
   * @template T The expected return type.
   * @template K The expected property target type.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The environment property at path.
   */
  abstract get<T extends Property, K = T>(
    path: Path,
    options: GetOptions<T, K> & { targetType: (property?: T) => K }
  ): K;
  abstract get<T extends Property, K = T>(
    path: Path,
    options: GetOptions<T, K> & ({ defaultValue: T } | { required: true })
  ): T;
  abstract get<T extends Property, K = T>(path: Path, options?: GetOptions<T, K>): T | undefined;

  abstract get<T extends Property, K = T>(
    path: Path,
    options?: GetOptions<T, K> & { required?: boolean }
  ): T | K | undefined;
}
