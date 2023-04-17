import { get, isEqual, isString, merge } from 'lodash-es';
import { combineLatest, firstValueFrom, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { DeepRequired } from 'ts-essentials';

import { asString, AtLeastOne, delayedPromise, filterNil, NonUndefined } from '../helpers';
import { Path } from '../path';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { EnvironmentQuery } from './environment-query.interface';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { environmentQueryConfigFactory } from './environment-query-config-factory.function';
import { EnvironmentReferenceError } from './environment-reference.error';
import { GetOptions, GetOptionsAsync, GetOptionsReactive } from './get-options.interface';

/**
 * Gets the properties from the EnvironmentState.
 */
export class DefaultEnvironmentQuery implements EnvironmentQuery {
  /**
   * Configuration parameters for EnvironmentQuery.
   */
  protected readonly config: DeepRequired<EnvironmentQueryConfig> = environmentQueryConfigFactory(this.queryConfig);

  /**
   * Gets the properties from the EnvironmentState.
   * @param store The EnvironmentStore.
   * @param queryConfig Configuration parameters for EnvironmentQuery.
   */
  constructor(
    protected readonly store: EnvironmentStore,
    protected readonly queryConfig?: EnvironmentQueryConfig | null
  ) {}

  getAll$(): Observable<EnvironmentState> {
    return this.store.getAll$().pipe(distinctUntilChanged(isEqual), shareReplay({ bufferSize: 1, refCount: true }));
  }

  async getAllAsync(): Promise<EnvironmentState> {
    const getAll$: Observable<EnvironmentState> = this.getAll$().pipe(
      filterNil(),
      filter((state: EnvironmentState) => Object.keys(state).length > 0)
    );

    return firstValueFrom(getAll$);
  }

  getAll(): EnvironmentState {
    return this.store.getAll();
  }

  containsAll$(...paths: AtLeastOne<Path>): Observable<boolean> {
    const containsList$: Observable<boolean>[] = paths.map((path: Path) => this.containsImpl$(path));

    return combineLatest(containsList$).pipe(
      map((containsList: Array<boolean>) => this.containsAllImpl(containsList)),
      distinctUntilChanged()
    );
  }

  containsAllAsync(...paths: AtLeastOne<Path>): Promise<boolean> {
    const containsAll$: Observable<boolean> = this.containsAll$(...paths).pipe(this.containsAsyncImpl());

    return firstValueFrom(containsAll$);
  }

  containsAll(...paths: AtLeastOne<Path>): boolean {
    const containsList: Array<boolean> = paths.map((path: Path) => this.containsImpl(path));

    return this.containsAllImpl(containsList);
  }

  containsSome$(...paths: AtLeastOne<Path>): Observable<boolean> {
    const containsList$: Observable<boolean>[] = paths.map((path: Path) => this.containsImpl$(path));

    return combineLatest(containsList$).pipe(
      map((containsList: Array<boolean>) => this.containsSomeImpl(containsList)),
      distinctUntilChanged()
    );
  }

  containsSomeAsync(...paths: AtLeastOne<Path>): Promise<boolean> {
    const containsSome$: Observable<boolean> = this.containsSome$(...paths).pipe(this.containsAsyncImpl());

    return firstValueFrom(containsSome$);
  }

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

  get$<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options?: GetOptionsReactive<T, K>
  ): Observable<T | K | undefined> {
    return this.getAll$().pipe(
      map((state: EnvironmentState) => this.getProperty(state, path)),
      map((property?: unknown) => this.getDefaultValue(property, options?.defaultValue)),
      map((property?: unknown) => this.getTargetType(property, options?.targetType)),
      map((property?: unknown) => this.getTranspile(property, options?.transpile, options?.config)),
      distinctUntilChanged(isEqual)
    );
  }

  getAsync<T extends NonUndefined<Property>, K = T>(
    path: Path,
    options?: GetOptionsAsync<T, K> & { dueTime?: number }
  ): Promise<T | K | undefined> {
    const get$: Observable<T | K> = this.get$<T, K>(path, options).pipe(filterNil());
    const getAsync: Promise<T | K> = firstValueFrom(get$);

    if (options?.dueTime != null) {
      const dueAsync: Promise<undefined> = delayedPromise(undefined, options.dueTime);

      return Promise.race([dueAsync, getAsync]);
    }

    return getAsync;
  }

  get<T extends NonUndefined<Property>, K = T>(path: Path, options?: GetOptions<T, K>): T | K | undefined {
    const state: EnvironmentState = this.getAll();
    let property: unknown = this.getProperty(state, path);

    property = this.getDefaultValue<T>(property, options?.defaultValue);
    property = this.getTargetType<T, K>(property, options?.targetType);
    property = this.getTranspile(property, options?.transpile, options?.config);

    if (options?.required && property === undefined) {
      throw new EnvironmentReferenceError(path);
    }

    return property as T | K | undefined;
  }

  protected getProperty(state: EnvironmentState, path: Path): unknown {
    return get(state, path);
  }

  protected getDefaultValue<T>(property?: unknown, defaultValue?: T): T | undefined {
    return property === undefined && defaultValue !== undefined ? defaultValue : (property as T | undefined);
  }

  protected getTargetType<T, K>(property?: unknown, targetType?: (property?: T) => K): T | K | undefined {
    return property !== undefined && targetType !== undefined ? targetType(property as T) : (property as T | undefined);
  }

  protected getTranspile<T>(
    property?: unknown,
    transpile?: EnvironmentState,
    config?: EnvironmentQueryConfig
  ): T | undefined {
    return property !== undefined && transpile !== undefined
      ? (this.transpile(transpile, property, config) as T)
      : (property as T | undefined);
  }

  protected transpile<T>(
    transpile: EnvironmentState,
    property?: Property | T,
    config?: EnvironmentQueryConfig
  ): T | Property {
    const localConfig: DeepRequired<EnvironmentQueryConfig> = this.getLocalConfig(config);

    if (isString(property)) {
      const matcher: RegExp = this.getMatcher(localConfig.interpolation);
      const transpileProperties: EnvironmentState = this.getTranspileProperties(
        transpile,
        localConfig.transpileEnvironment
      );

      return property.replace(matcher, (substring: string, path: Path) =>
        this.replacer(substring, path, transpileProperties)
      );
    }

    return property;
  }

  protected getLocalConfig(config?: EnvironmentQueryConfig): DeepRequired<EnvironmentQueryConfig> {
    const innerConfig: DeepRequired<EnvironmentQueryConfig> = { ...this.config };

    innerConfig.interpolation = config?.interpolation ?? innerConfig.interpolation;
    innerConfig.transpileEnvironment = config?.transpileEnvironment ?? innerConfig.transpileEnvironment;

    return innerConfig;
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

    return merge({}, state, properties);
  }

  protected replacer(substring: string, path: Path, properties: EnvironmentState): string {
    const value: Property | undefined = get(properties, path);

    if (value == null) {
      return substring;
    }

    return asString(value);
  }
}
