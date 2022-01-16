import { get, isEqual, isString, mergeWith } from 'lodash-es';
import { combineLatest, firstValueFrom, MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, take } from 'rxjs/operators';

import { AtLeastOne, filterNil } from '../helpers';
import { Path } from '../path';
import { mergeArraysCustomizer } from '../shared';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { environmentConfigFactory } from './environment-config-factory.function';
import { EnvironmentConfig } from './environment-config.interface';
import { GetOptions } from './get-options.interface';

/**
 * Gets the properties from the environment.
 */
export class EnvironmentQuery {
  private readonly _config: Required<EnvironmentConfig> = environmentConfigFactory(this.config);

  /**
   * Gets the properties from the environment store.
   * @param store Manages the environment store.
   * @param config Partial configuration parameters for the Environment module.
   */
  constructor(protected readonly store: EnvironmentStore, protected readonly config?: EnvironmentConfig) {}

  /**
   * Gets all the environment properties.
   * @returns All the distinct environment properties as Observable.
   */
  getAll$(): Observable<EnvironmentState> {
    return this.store.getAll$().pipe(distinctUntilChanged(isEqual), shareReplay(1));
  }

  /**
   * Gets all the environment properties.
   * @returns The first non nil or empty set of environment properties as Promise.
   */
  async getAllAsync(): Promise<EnvironmentState> {
    const getAll$: Observable<EnvironmentState> = this.getAll$().pipe(
      filterNil(),
      filter((environment: EnvironmentState) => Object.keys(environment).length > 0),
    );

    return firstValueFrom(getAll$);
  }

  /**
   * Gets all the environment properties.
   * @returns All the environment properties.
   */
  getAll(): EnvironmentState {
    return this.store.getAll();
  }

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns distinct `true` as Observable if all the environment property paths exists, otherwise `false`.
   * @see Path
   */
  containsAll$(...paths: AtLeastOne<Path>): Observable<boolean> {
    const containsList$: Observable<boolean>[] = paths.map((path: Path) => this._contains$(path));

    return combineLatest(containsList$).pipe(
      map((containsList: Array<boolean>) => this._containsAll(containsList)),
      distinctUntilChanged(),
    );
  }

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The property path to resolve.
   * @returns The first `true` as Promise when all environment property paths exists.
   * @see Path
   */
  containsAllAsync(...paths: AtLeastOne<Path>): Promise<boolean> {
    const containsAll$: Observable<boolean> = this.containsAll$(...paths).pipe(this._containsAsync());

    return firstValueFrom(containsAll$);
  }

  /**
   * Checks if all the environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns `true` if all the environment property paths exists, otherwise `false`.
   * @see Path
   */
  containsAll(...paths: AtLeastOne<Path>): boolean {
    const containsList: Array<boolean> = paths.map((path: Path) => this._contains(path));

    return this._containsAll(containsList);
  }

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns distinct `true` as Observable if some environment property paths exists, otherwise `false`.
   * @see Path
   */
  containsSome$(...paths: AtLeastOne<Path>): Observable<boolean> {
    const containsList$: Observable<boolean>[] = paths.map((path: Path) => this._contains$(path));

    return combineLatest(containsList$).pipe(
      map((containsList: Array<boolean>) => this._containsSome(containsList)),
      distinctUntilChanged(),
    );
  }

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The property path to resolve.
   * @returns The first `true` as Promise when some environment property paths exists.
   * @see Path
   */
  containsSomeAsync(...paths: AtLeastOne<Path>): Promise<boolean> {
    const containsSome$: Observable<boolean> = this.containsSome$(...paths).pipe(this._containsAsync());

    return firstValueFrom(containsSome$);
  }

  /**
   * Checks if some environment property paths are available for resolution.
   * @param paths The list of property paths to resolve.
   * @returns `true` if some environment property paths exists, otherwise `false`.
   * @see Path
   */
  containsSome(...paths: AtLeastOne<Path>): boolean {
    const containsList: Array<boolean> = paths.map((path: Path) => this._contains(path));

    return this._containsSome(containsList);
  }

  private _containsDef(property?: Property): boolean {
    return property !== undefined;
  }

  private _contains$(path: Path): Observable<boolean> {
    return this.get$<Property>(path).pipe(
      map((property?: Property) => this._containsDef(property)),
      distinctUntilChanged(),
    );
  }

  private _contains(path: Path): boolean {
    const property: Property | undefined = this.get(path);

    return this._containsDef(property);
  }

  private _containsAsync(): MonoTypeOperatorFunction<boolean> {
    return (observable: Observable<boolean>) => observable.pipe(filter((property: boolean) => property === true));
  }

  private _containsAll(containsList: Array<boolean>): boolean {
    return containsList.every((contains: boolean) => contains);
  }

  private _containsSome(containsList: Array<boolean>): boolean {
    return containsList.some((contains: boolean) => contains);
  }

  /**
   * Gets the environment property at path.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The distinct environment property at path as Observable.
   * @see Path
   */
  get$<T = Property>(path: Path, options?: GetOptions<T>): Observable<T | undefined> {
    return this.getAll$().pipe(
      map((environment: EnvironmentState) => this._getProperty(environment, path)),
      map((property?: Property) => this._getDefaultValue(property, options?.defaultValue)),
      map((property?: Property) => this._getTargetType(property, options?.targetType)),
      map((property?: Property | T) =>
        this._getTranspile(property, options?.transpile, options?.interpolation, options?.transpileEnvironment),
      ),
      distinctUntilChanged(isEqual),
    );
  }

  /**
   * Gets the environment property at path.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The first non nil environment property at path as Promise.
   * @see Path
   */
  getAsync<T = Property>(path: Path, options?: GetOptions<T>): Promise<T | undefined> {
    const get$: Observable<T | undefined> = this.get$<T>(path, options).pipe(filterNil(), take(1));

    return firstValueFrom(get$);
  }

  /**
   * Gets the environment property at path.
   * @param path The property path to resolve.
   * @param options The options to get a property.
   * @returns The environment property at path.
   * @see Path
   */
  get<T = Property>(path: Path, options?: GetOptions<T>): T | undefined {
    const environment: EnvironmentState = this.getAll();

    let property: Property | T | undefined = this._getProperty(environment, path);
    property = this._getDefaultValue(property, options?.defaultValue);
    property = this._getTargetType(property, options?.targetType);
    property = this._getTranspile(property, options?.transpile, options?.interpolation, options?.transpileEnvironment);

    return property as T;
  }

  private _getProperty(environment: EnvironmentState, path: Path): Property | undefined {
    return get(environment, path);
  }

  private _getDefaultValue(property?: Property, defaultValue?: Property): Property | undefined {
    return property === undefined && defaultValue !== undefined ? defaultValue : property;
  }

  private _getTargetType<T>(property?: Property, targetType?: (property: Property) => T): Property | T | undefined {
    return property !== undefined && targetType !== undefined ? targetType(property) : property;
  }

  private _getTranspile<T>(
    property?: Property | T,
    transpile?: EnvironmentState,
    interpolation?: [string, string],
    useEnvironmentToTranspile?: boolean,
  ): Property | T | undefined {
    return property !== undefined && transpile !== undefined
      ? this._transpile(transpile, property, interpolation, useEnvironmentToTranspile)
      : property;
  }

  private _transpile<T>(
    transpile: EnvironmentState,
    property?: Property | T,
    interpolation?: [string, string],
    useEnvironmentToTranspile?: boolean,
  ): Property | T | undefined {
    const config: Required<EnvironmentConfig> = this._config;

    if (interpolation != null) {
      config.interpolation = interpolation;
    }

    if (useEnvironmentToTranspile != null) {
      config.transpileEnvironment = useEnvironmentToTranspile;
    }

    if (isString(property)) {
      const matcher: RegExp = this._getMatcher(config.interpolation);

      return property.replace(matcher, (substring: string, match: string) => {
        const transpileProperties: EnvironmentState = this._getTranspileProperties(
          transpile,
          config.transpileEnvironment,
        );

        return this._replacer(substring, match, transpileProperties);
      });
    }

    return property;
  }

  private _getMatcher(interpolation: [string, string]): RegExp {
    const [start, end]: [string, string] = interpolation;
    const escapedStart: string = this._escapeChars(start);
    const escapedEnd: string = this._escapeChars(end);

    return new RegExp(`${escapedStart}\\s*(.*?)\\s*${escapedEnd}`, 'g');
  }

  private _escapeChars(chars: string): string {
    return [...chars].map((char: string) => `\\${char}`).join('');
  }

  private _getTranspileProperties(properties: EnvironmentState, useEnvironmentToTranspile: boolean): EnvironmentState {
    if (!useEnvironmentToTranspile) {
      return properties;
    }

    const environment: EnvironmentState = this.store.getAll();

    return mergeWith(environment, properties, mergeArraysCustomizer);
  }

  private _replacer(substring: string, match: string, properties: EnvironmentState): string {
    const value: Property | undefined = get(properties, match);

    if (value == null) {
      return substring;
    }

    try {
      return typeof value === 'object' ? JSON.stringify(value) : String(value);
    } catch {
      return String(value);
    }
  }
}
