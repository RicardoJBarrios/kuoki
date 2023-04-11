import { get, isEqual, isString, merge } from 'lodash-es';
import { combineLatest, firstValueFrom, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay } from 'rxjs/operators';
import { DeepRequired } from 'ts-essentials';

import { asString, AtLeastOne, delayedPromise, filterNil } from '../helpers';
import { Path } from '../path';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { EnvironmentQuery } from './environment-query.interface';
import { EnvironmentQueryConfig } from './environment-query-config.interface';
import { environmentQueryConfigFactory } from './environment-query-config-factory.function';
import { GetOptions } from './get-options.interface';
import { GetProperty } from './get-property.type';

/**
 * Gets the properties from the environment.
 */
export class DefaultEnvironmentQuery implements EnvironmentQuery {
  /**
   * The configuration parameters for the environment query.
   */
  protected readonly config: DeepRequired<EnvironmentQueryConfig> = environmentQueryConfigFactory(this.queryConfig);

  /**
   * Gets the properties from the environment store.
   * @param store Manages the environment store.
   * @param queryConfig Configuration parameters for the environment query.
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

  get$<T = Property>(path: Path, options?: GetOptions<T>): Observable<T | undefined> {
    return this.getAll$().pipe(
      map((state: EnvironmentState) => this.getProperty(state, path)),
      map((property?: Property) => this.getDefaultValue(property, options?.defaultValue)),
      map((property?: Property) => this.getTargetType(property, options?.targetType)),
      map((property?: Property | T) => this.getTranspile(property, options?.transpile, options?.config)),
      distinctUntilChanged(isEqual)
    );
  }

  getAsync<T = Property>(path: Path, options?: GetOptions<T>): Promise<T | undefined> {
    const get$: Observable<T | undefined> = this.get$<T>(path, options).pipe(filterNil());
    const getAsync: Promise<T | undefined> = firstValueFrom(get$);

    if (options?.dueTime != null) {
      const dueAsync: Promise<undefined> = delayedPromise(undefined, options.dueTime);

      return Promise.race([dueAsync, getAsync]);
    }

    return getAsync;
  }

  get<T = Property>(path: Path, options?: GetOptions<T>): T | undefined {
    const state: EnvironmentState = this.getAll();
    let property: GetProperty<T> = this.getProperty(state, path);

    property = this.getDefaultValue(property, options?.defaultValue);
    property = this.getTargetType(property, options?.targetType);
    property = this.getTranspile(property, options?.transpile, options?.config);

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
    config?: EnvironmentQueryConfig
  ): GetProperty<T> {
    return property !== undefined && transpile !== undefined ? this.transpile(transpile, property, config) : property;
  }

  protected transpile<T>(
    transpile: EnvironmentState,
    property?: Property | T,
    config?: EnvironmentQueryConfig
  ): GetProperty<T> {
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
