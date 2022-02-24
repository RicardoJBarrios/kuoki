import { get, isEqual, isString, merge } from 'lodash-es';
import { combineLatest, firstValueFrom, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';

import { asString, AtLeastOne, filterNil } from '../helpers';
import { Path } from '../path';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { environmentQueryConfigFactory } from './environment-query-config-factory.function';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { GetOptions } from './get-options.interface';
import { GetProperty } from './get-property.type';

/**
 * Gets the properties from the environment.
 * @template STORE The store used by the implementation.
 * @template CONFIG The query config used by the implementation.
 * @see {@link EnvironmentStore}
 * @see {@link EnvironmentQueryConfig}
 */
export class EnvironmentQuery<
  STORE extends EnvironmentStore = EnvironmentStore,
  CONFIG extends EnvironmentQueryConfig = EnvironmentQueryConfig
> {
  /**
   * The configuration parameters for the environment query.
   * @see {@link EnvironmentQueryConfig}
   */
  protected readonly config: Required<CONFIG> = environmentQueryConfigFactory(this.queryConfig);

  /**
   * Gets the properties from the environment store.
   * @param store Manages the environment store.
   * @param queryConfig Configuration parameters for the environment query.
   * @see {@link EnvironmentStore}
   * @see {@link EnvironmentQueryConfig}
   */
  constructor(protected readonly store: STORE, protected readonly queryConfig?: CONFIG) {}

  /**
   * Gets all the environment properties.
   * @returns All the distinct environment properties as Observable.
   * @see {@link Observable}
   * @see {@link EnvironmentState}
   */
  getAll$(): Observable<EnvironmentState> {
    return this.store.getAll$().pipe(distinctUntilChanged(isEqual), shareReplay(1));
  }

  /**
   * Gets all the environment properties.
   * @returns The first non nil or empty set of environment properties as Promise.
   * @see {@link Promise}
   * @see {@link EnvironmentState}
   */
  async getAllAsync(): Promise<EnvironmentState> {
    const getAll$: Observable<EnvironmentState> = this.getAll$().pipe(
      filterNil(),
      filter((state: EnvironmentState) => Object.keys(state).length > 0)
    );

    return firstValueFrom(getAll$);
  }

  /**
   * Gets all the environment properties.
   * @returns All the environment properties.
   * @see {@link EnvironmentState}
   */
  getAll(): EnvironmentState {
    return this.store.getAll();
  }

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns distinct `true` as Observable if all the environment property paths exists, otherwise `false`.
   * @see {@link Path}
   * @see {@link Observable}
   */
  containsAll$(...paths: AtLeastOne<Path>): Observable<boolean> {
    const containsList$: Observable<boolean>[] = paths.map((path: Path) => this.containsImpl$(path));

    return combineLatest(containsList$).pipe(
      map((containsList: Array<boolean>) => this.containsAllImpl(containsList)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The property path to resolve.
   * @returns The first `true` as Promise when all environment property paths exists.
   * @see {@link Path}
   * @see {@link Promise}
   */
  containsAllAsync(...paths: AtLeastOne<Path>): Promise<boolean> {
    const containsAll$: Observable<boolean> = this.containsAll$(...paths).pipe(this.containsAsyncImpl());

    return firstValueFrom(containsAll$);
  }

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns `true` if all the environment property paths exists, otherwise `false`.
   * @see {@link Path}
   */
  containsAll(...paths: AtLeastOne<Path>): boolean {
    const containsList: Array<boolean> = paths.map((path: Path) => this.containsImpl(path));

    return this.containsAllImpl(containsList);
  }

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns distinct `true` as Observable if some environment property paths exists, otherwise `false`.
   * @see {@link Path}
   * @see {@link Observable}
   */
  containsSome$(...paths: AtLeastOne<Path>): Observable<boolean> {
    const containsList$: Observable<boolean>[] = paths.map((path: Path) => this.containsImpl$(path));

    return combineLatest(containsList$).pipe(
      map((containsList: Array<boolean>) => this.containsSomeImpl(containsList)),
      distinctUntilChanged()
    );
  }

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The property path to resolve.
   * @returns The first `true` as Promise when some environment property paths exists.
   * @see {@link Path}
   * @see {@link Promise}
   */
  containsSomeAsync(...paths: AtLeastOne<Path>): Promise<boolean> {
    const containsSome$: Observable<boolean> = this.containsSome$(...paths).pipe(this.containsAsyncImpl());

    return firstValueFrom(containsSome$);
  }

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns `true` if some environment property paths exists, otherwise `false`.
   * @see {@link Path}
   */
  containsSome(...paths: AtLeastOne<Path>): boolean {
    const containsList: Array<boolean> = paths.map((path: Path) => this.containsImpl(path));

    return this.containsSomeImpl(containsList);
  }

  protected containsDefImpl(property?: Property): boolean {
    return property !== undefined;
  }

  protected containsImpl$(path: Path): Observable<boolean> {
    return this.get$(path).pipe(
      map((property?: Property) => this.containsDefImpl(property)),
      distinctUntilChanged()
    );
  }

  protected containsImpl(path: Path): boolean {
    const property: Property | undefined = this.get(path);

    return this.containsDefImpl(property);
  }

  protected containsAsyncImpl(): MonoTypeOperatorFunction<boolean> {
    return (observable: Observable<boolean>) => observable.pipe(filter((property: boolean) => property === true));
  }

  protected containsAllImpl(containsList: Array<boolean>): boolean {
    return containsList.every((contains: boolean) => contains);
  }

  protected containsSomeImpl(containsList: Array<boolean>): boolean {
    return containsList.some((contains: boolean) => contains);
  }

  /**
   * Gets the environment property at path.
   * @template T The expected return type.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The distinct environment property at path as Observable.
   * @see {@link Path}
   * @see {@link GetOptions}
   * @see {@link Observable}
   * @see {@link Property}
   */
  get$<T = Property>(path: Path, options?: GetOptions<T>): Observable<T | undefined> {
    return this.getAll$().pipe(
      map((state: EnvironmentState) => this.getProperty(state, path)),
      map((property?: Property) => this.getDefaultValue(property, options?.defaultValue)),
      map((property?: Property) => this.getTargetType(property, options?.targetType)),
      map((property?: Property | T) =>
        this.getTranspile(property, options?.transpile, options?.transpileEnvironment, options?.interpolation)
      ),
      distinctUntilChanged(isEqual)
    );
  }

  /**
   * Gets the environment property at path.
   * @template T The expected return type.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The first non nil environment property at path as Promise.
   * @see {@link Path}
   * @see {@link GetOptions}
   * @see {@link Promise}
   * @see {@link Property}
   */
  getAsync<T = Property>(path: Path, options?: GetOptions<T>): Promise<T | undefined> {
    const get$: Observable<T | undefined> = this.get$<T>(path, options).pipe(filterNil());

    return firstValueFrom(get$);
  }

  /**
   * Gets the environment property at path.
   * @template T The expected return type.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The environment property at path.
   * @see {@link Path}
   * @see {@link GetOptions}
   * @see {@link Property}
   */
  get<T = Property>(path: Path, options?: GetOptions<T>): T | undefined {
    const state: EnvironmentState = this.getAll();

    let property: GetProperty<T> = this.getProperty(state, path);
    property = this.getDefaultValue(property, options?.defaultValue);
    property = this.getTargetType(property, options?.targetType);
    property = this.getTranspile(property, options?.transpile, options?.transpileEnvironment, options?.interpolation);

    return property as T;
  }

  protected getProperty(state: EnvironmentState, path: Path): Property | undefined {
    return get(state, path);
  }

  protected getDefaultValue(property?: Property, defaultValue?: Property): Property | undefined {
    return property === undefined && defaultValue !== undefined ? defaultValue : property;
  }

  protected getTargetType<T>(property?: Property, targetType?: (property: Property) => T): GetProperty<T> {
    return property !== undefined && targetType !== undefined ? targetType(property) : property;
  }

  protected getTranspile<T>(
    property?: Property | T,
    transpile?: EnvironmentState,
    transpileEnvironment?: boolean,
    interpolation?: [string, string]
  ): GetProperty<T> {
    return property !== undefined && transpile !== undefined
      ? this.transpile(transpile, property, transpileEnvironment, interpolation)
      : property;
  }

  protected transpile<T>(
    transpile: EnvironmentState,
    property?: Property | T,
    transpileEnvironment?: boolean,
    interpolation?: [string, string]
  ): GetProperty<T> {
    const config: Required<CONFIG> = { ...this.config };

    if (interpolation != null) {
      config.interpolation = interpolation;
    }

    if (transpileEnvironment != null) {
      config.transpileEnvironment = transpileEnvironment;
    }

    if (isString(property)) {
      const matcher: RegExp = this.getMatcher(config.interpolation as [string, string]);

      return property.replace(matcher, (substring: string, match: string) => {
        const transpileProperties: EnvironmentState = this.getTranspileProperties(
          transpile,
          config.transpileEnvironment as boolean
        );

        return this.replacer(substring, match, transpileProperties);
      });
    }

    return property;
  }

  protected getMatcher(interpolation: [string, string]): RegExp {
    const [start, end]: [string, string] = interpolation;
    const escapedStart: string = this.escapeChars(start);
    const escapedEnd: string = this.escapeChars(end);

    return new RegExp(`${escapedStart}\\s*(.*?)\\s*${escapedEnd}`, 'g');
  }

  protected escapeChars(chars: string): string {
    return [...chars].map((char: string) => `\\${char}`).join('');
  }

  protected getTranspileProperties(properties: EnvironmentState, transpileEnvironment: boolean): EnvironmentState {
    if (!transpileEnvironment) {
      return properties;
    }

    const state: EnvironmentState = this.store.getAll();

    return merge(state, properties);
  }

  protected replacer(substring: string, match: string, properties: EnvironmentState): string {
    const value: Property | undefined = get(properties, match);

    if (value == null) {
      return substring;
    }

    return asString(value);
  }
}
