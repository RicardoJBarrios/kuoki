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
import { EnvironmentLoader } from './environment-loader.interface';
import { sourcesSubjectFactory } from './sources-subject-factory.function';

/**
 * Loads the environment properties from the provided asynchronous sources.
 */
export class DefaultEnvironmentLoader implements EnvironmentLoader {
  protected readonly loadSubject$: ReplaySubject<void> = new ReplaySubject();
  protected readonly isRequiredSubject$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  protected readonly loaderSources: ReadonlyArray<LoaderSource> = loaderSourcesFactory(this.sources);
  protected readonly sourcesSubject$: ReadonlyMap<string, ReplaySubject<void>> = sourcesSubjectFactory(
    this.loaderSources
  );
  protected isLoading = false;

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @throws InvalidSourceError if an environmnet source is invalid.
   * @throws DuplicatedSourcesError If there are sources with duplicated ids.
   * @see {@link InvalidSourceError}
   * @see {@link DuplicatedSourcesError}
   */
  constructor(
    protected readonly service: EnvironmentService,
    protected readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {}

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
      this.loaderSources.filter((source: LoaderSource) => source.isRequired).map((source: LoaderSource) => source.id)
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
    const orderedSources: LoaderSource[] = this.loaderSources.filter((source: LoaderSource) => source.isOrdered);
    const orderedSources$: Observable<EnvironmentState>[] = this.getSources$(orderedSources);

    return concat(...orderedSources$);
  }

  protected loadUnorderedSources(): Observable<EnvironmentState> {
    const unorderedSources: LoaderSource[] = this.loaderSources.filter((source: LoaderSource) => !source.isOrdered);
    const unorderedSources$: Observable<EnvironmentState>[] = this.getSources$(unorderedSources);

    return merge(...unorderedSources$);
  }

  protected getSources$(sources: LoaderSource[]): Observable<EnvironmentState>[] {
    return sources.map((source: LoaderSource) => {
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

  protected checkErrorHandler<E>(error: E, source: LoaderSource): Observable<EnvironmentState> {
    if (source.errorHandler != null) {
      const state: EnvironmentState = source.errorHandler(error);

      return of(state);
    }

    throw asError(error);
  }

  protected checkMapFn(properties: EnvironmentState, source: LoaderSource): EnvironmentState {
    return source.mapFn != null ? source.mapFn(properties) : properties;
  }

  preAddProperties(properties: EnvironmentState, source?: LoaderSource): EnvironmentState {
    return properties;
  }

  protected addToStore(properties: EnvironmentState, source: LoaderSource): void {
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

  protected checkSourceLoadError<E>(error: E, source: LoaderSource): Observable<EnvironmentState> {
    const newError: Error = asError(error);
    const originalMessage: string = newError.message ? `: ${newError.message}` : '';
    newError.message = `The environment source "${source.id}" failed to load${originalMessage}`;

    lifecycleHook(this, 'onAfterSourceError', newError, source);

    if (source.isRequired && !source.ignoreError && this.isLoading) {
      this.rejectLoad(newError);
    }

    return of({});
  }

  protected checkRequiredToLoad(source: LoaderSource): void {
    if (source.isRequired) {
      const isRequiredLoaded: Set<string> = this.isRequiredSubject$.getValue().add(source.id);

      this.isRequiredSubject$.next(isRequiredLoaded);
    }
  }

  getSourceById(id: string): LoaderSource | undefined {
    return this.loaderSources.find((source: LoaderSource) => id === source.id);
  }

  resolveLoad(): void {
    this.loadSubject$.next();
  }

  rejectLoad<E>(error: E): void {
    const newError: Error = asError(error);

    this.loadSubject$.error(newError);
  }

  completeAllSources(): void {
    this.loaderSources.forEach((source: LoaderSource) => this.completeSource(source));
  }

  completeSource(source: LoaderSource): void {
    const sourceSubject$: ReplaySubject<void> | undefined = this.sourcesSubject$.get(source.id);

    if (sourceSubject$ != null) {
      sourceSubject$.next();
      this.checkRequiredToLoad(source);
    }
  }

  onDestroy(): void {
    this.completeAllSources();
    this.loadSubject$.complete();
    this.isRequiredSubject$.complete();
    this.sourcesSubject$.forEach((subject: ReplaySubject<void>) => subject.complete());
  }
}
