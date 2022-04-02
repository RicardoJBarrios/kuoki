import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  catchError,
  concat,
  defer,
  filter,
  finalize,
  firstValueFrom,
  map,
  merge,
  Observable,
  of,
  ReplaySubject,
  take,
  takeUntil,
  tap
} from 'rxjs';
import { ArrayOrSingle } from 'ts-essentials';

import { asError } from '../helpers';
import { lifecycleHook } from '../lifecycle-hooks';
import { LoaderSource, loaderSourcesFactory } from '../loader-source';
import { EnvironmentService } from '../service';
import { EnvironmentSource, SourceStrategy } from '../source';
import { EnvironmentState } from '../store';
import { sourcesSubjectFactory } from './sources-subject-factory.function';

/**
 * Loads the environment properties from the provided asynchronous sources.
 * @see {@link EnvironmentService}
 * @see {@link EnvironmentSource}
 * @see {@link LoaderSource}
 */
export class EnvironmentLoader<
  SERVICE extends EnvironmentService = EnvironmentService,
  SOURCE extends EnvironmentSource = EnvironmentSource,
  LOADER_SOURCE extends LoaderSource = LoaderSource
> {
  protected readonly loadSubject$: ReplaySubject<void> = new ReplaySubject();
  protected readonly isRequiredSubject$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  protected readonly loaderSources: ReadonlyArray<LOADER_SOURCE> = loaderSourcesFactory(this.sources);
  protected readonly sourcesSubject$: ReadonlyMap<string, ReplaySubject<void>> = sourcesSubjectFactory(
    this.loaderSources
  );
  protected isLoading = false;

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @param service Sets properties in the environment store.
   * @param sources The environment properties sources to get the application properties asynchronously.
   * @throws InvalidSourceError if an environmnet source is invalid.
   * @throws DuplicatedSourcesError If there are sources with duplicated ids.
   * @see {@link EnvironmentService}
   * @see {@link EnvironmentSource}
   * @see {@link LoaderSource}
   * @see {@link InvalidSourceError}
   * @see {@link DuplicatedSourcesError}
   */
  constructor(protected readonly service: SERVICE, protected readonly sources?: ArrayOrSingle<SOURCE> | null) {}

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @returns A promise once the required sources are loaded.
   */
  async load(): Promise<void> {
    lifecycleHook(this, 'onBeforeLoad');
    this.isLoading = true;

    this.watchRequiredToLoadSources();
    this.loadSources();

    return firstValueFrom(this.loadSubject$)
      .then(() => {
        lifecycleHook(this, 'onAfterLoad');
        return Promise.resolve();
      })
      .catch(<E extends Error>(error: E) => {
        lifecycleHook(this, 'onAfterError', error);
        return Promise.reject(error);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  protected watchRequiredToLoadSources(): void {
    const isRequiredSources: Set<string> = new Set(
      this.loaderSources.filter((source: LOADER_SOURCE) => source.isRequired).map((source: LOADER_SOURCE) => source.id)
    );

    this.isRequiredSubject$
      .pipe(
        filter((isRequiredLoaded: Set<string>) => isEqual(isRequiredLoaded, isRequiredSources)),
        tap({ next: () => this.resolveLoad() }),
        take(1)
      )
      .subscribe();
  }

  protected loadSources(): void {
    merge(this.loadOrderedSources(), this.loadUnorderedSources())
      .pipe(
        finalize(() => {
          lifecycleHook(this, 'onAfterComplete');
          this.onDestroy();
        })
      )
      .subscribe();
  }

  protected loadOrderedSources(): Observable<EnvironmentState> {
    const orderedSources: LOADER_SOURCE[] = this.loaderSources.filter((source: LOADER_SOURCE) => source.isOrdered);
    const orderedSources$: Observable<EnvironmentState>[] = this.getSources$(orderedSources);

    return concat(...orderedSources$);
  }

  protected loadUnorderedSources(): Observable<EnvironmentState> {
    const unorderedSources: LOADER_SOURCE[] = this.loaderSources.filter((source: LOADER_SOURCE) => !source.isOrdered);
    const unorderedSources$: Observable<EnvironmentState>[] = this.getSources$(unorderedSources);

    return merge(...unorderedSources$);
  }

  protected getSources$(sources: LOADER_SOURCE[]): Observable<EnvironmentState>[] {
    return sources.map((source: LOADER_SOURCE) => {
      return defer(() => {
        lifecycleHook(this, 'onBeforeSourceLoad', source);

        return source.load();
      }).pipe(
        catchError(<E>(error: E) => this.checkErrorHandler(error, source)),
        tap((properties: EnvironmentState) => lifecycleHook(this, 'onBeforeSourceAdd', properties, source)),
        map((properties: EnvironmentState) => this.checkMapFn(properties, source)),
        map((properties: EnvironmentState) => this.preAddProperties(properties, source)),
        tap((properties: EnvironmentState) => this.addToStore(properties, source)),
        tap((properties: EnvironmentState) => lifecycleHook(this, 'onAfterSourceAdd', properties, source)),
        catchError(<E>(error: E) => this.checkSourceLoadError(error, source)),
        finalize(() => {
          lifecycleHook(this, 'onAfterSourceComplete', source);
          this.checkRequiredToLoad(source);
        }),
        takeUntil(this.sourcesSubject$.get(source.id) as ReplaySubject<void>)
      );
    });
  }

  protected checkErrorHandler<E>(error: E, source: LOADER_SOURCE): Observable<EnvironmentState> {
    if (source.errorHandler != null) {
      const state: EnvironmentState = source.errorHandler(error);

      return of(state);
    }

    throw asError(error);
  }

  protected checkMapFn(properties: EnvironmentState, source: LOADER_SOURCE): EnvironmentState {
    return source.mapFn != null ? source.mapFn(properties) : properties;
  }

  /**
   * Middleware function that gives the possibility to modify the source properties before inserting it into the environment.
   * @param properties The source properties.
   * @param source The environment properties source.
   * @returns The modified source properties.
   */
  preAddProperties(properties: EnvironmentState, source?: LOADER_SOURCE): EnvironmentState {
    return properties;
  }

  protected addToStore(properties: EnvironmentState, source: LOADER_SOURCE): void {
    switch (source.strategy) {
      case SourceStrategy.ADD_PRESERVING:
        this.service.addPreserving(properties, source.path);
        break;
      case SourceStrategy.MERGE:
        this.service.merge(properties, source.path);
        break;
      case SourceStrategy.MERGE_PRESERVING:
        this.service.mergePreserving(properties, source.path);
        break;
      default:
        this.service.add(properties, source.path);
    }
  }

  protected checkSourceLoadError<E>(error: E, source: LOADER_SOURCE): Observable<EnvironmentState> {
    const newError: Error = asError(error);
    const originalMessage: string = newError.message ? `: ${newError.message}` : '';
    newError.message = `The environment source "${source.id}" failed to load${originalMessage}`;

    lifecycleHook(this, 'onAfterSourceError', newError, source);

    if (source.isRequired && !source.ignoreError && this.isLoading) {
      this.rejectLoad(newError);
    }

    return of({});
  }

  protected checkRequiredToLoad(source: LOADER_SOURCE): void {
    if (source.isRequired) {
      const isRequiredLoaded: Set<string> = this.isRequiredSubject$.getValue().add(source.id);

      this.isRequiredSubject$.next(isRequiredLoaded);
    }
  }

  /**
   * Forces the load to resolve.
   */
  resolveLoad(): void {
    this.loadSubject$.next();
  }

  /**
   * Forces the load to reject.
   * @template E The type of the error.
   * @param error The error to throw.
   */
  rejectLoad<E>(error: E): void {
    const newError: Error = asError(error);

    this.loadSubject$.error(newError);
  }

  /**
   * Forces the load to resolve and stops all ongoing source loads.
   */
  completeAllSources(): void {
    this.loaderSources.forEach((source: LOADER_SOURCE) => this.completeSource(source));
  }

  /**
   * Completes a source load.
   * @param source The source to complete.
   */
  completeSource(source: LOADER_SOURCE): void {
    const sourceSubject$: ReplaySubject<void> | undefined = this.sourcesSubject$.get(source.id);

    if (sourceSubject$ != null) {
      sourceSubject$.next();
      this.checkRequiredToLoad(source);
    }
  }

  /**
   * Forces the load to resolve, stops all ongoing source loads and completes the subjects.
   */
  onDestroy(): void {
    this.completeAllSources();
    this.loadSubject$.complete();
    this.isRequiredSubject$.complete();
    this.sourcesSubject$.forEach((subject: ReplaySubject<void>) => subject.complete());
  }
}
