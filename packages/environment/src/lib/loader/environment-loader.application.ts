import { isEqual } from 'lodash-es';
import {
  BehaviorSubject,
  catchError,
  concat,
  defer,
  filter,
  finalize,
  firstValueFrom,
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
import { EnvironmentService } from '../service';
import { EnvironmentSource, SourceStrategy } from '../source';
import { EnvironmentState } from '../store';
import { lifecycleHook } from './lifecycle-hook.function';
import { LoaderSource } from './loader-source.type';
import { loaderSourcesFactory } from './loader-sources-factory.function';
import { sourcesSubjectFactory } from './sources-subject-factory.function';

/**
 * Loads the environment properties from the provided asynchronous sources.
 */
export class EnvironmentLoader<
  SERVICE extends EnvironmentService = EnvironmentService,
  SOURCE extends EnvironmentSource = EnvironmentSource,
  LOADER_SOURCE extends LoaderSource = LoaderSource
> {
  protected readonly loadSubject$: ReplaySubject<void> = new ReplaySubject();
  protected readonly isRequiredSubject$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  protected readonly loaderSources: ReadonlyArray<LOADER_SOURCE> = loaderSourcesFactory(this.sources);
  protected readonly sourcesSubject$: ReadonlyMap<string, ReplaySubject<void>>;
  protected isLoading = false;

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @param service Sets properties in the environment store.
   * @param sources The environment properties sources to get the application properties asynchronously.
   */
  constructor(protected readonly service: SERVICE, protected readonly sources?: ArrayOrSingle<SOURCE>) {
    this.checkSourcesIdUniqueness();
    this.sourcesSubject$ = sourcesSubjectFactory(this.loaderSources);
  }

  protected checkSourcesIdUniqueness(): void {
    const ids: string[] = this.loaderSources.map((source: LOADER_SOURCE) => source.id);
    const duplicates = ids.filter((item: string, index: number) => ids.indexOf(item) !== index);

    if (duplicates.length > 0) {
      throw new Error(`There are sources with duplicate id's: ${duplicates.join(', ')}`);
    }
  }

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
        tap({
          next: (properties: EnvironmentState) => {
            lifecycleHook(this, 'onBeforeSourceAdd', properties, source);
            const modifiedProperties: EnvironmentState = this.preAddProperties(properties, source);
            this.saveSourceValueToStore(modifiedProperties, source);
            lifecycleHook(this, 'onAfterSourceAdd', modifiedProperties, source);
          }
        }),
        catchError(<E>(error: E) => this.checkSourceLoadError(error, source)),
        finalize(() => {
          lifecycleHook(this, 'onAfterSourceComplete', source);
          this.checkRequiredToLoad(source);
        }),
        takeUntil(this.sourcesSubject$.get(source.id) as ReplaySubject<void>)
      );
    });
  }

  /**
   * Middleware function that gives the possibility to modify the source properties before inserting it into the environment.
   * @param properties The source properties.
   * @param source The environment properties source.
   * @returns The modified source properties.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  preAddProperties(properties: EnvironmentState, source?: LOADER_SOURCE): EnvironmentState {
    return properties;
  }

  protected saveSourceValueToStore(properties: EnvironmentState, source: LOADER_SOURCE): void {
    if (source.strategy === SourceStrategy.MERGE) {
      this.service.merge(properties, source.path);
    } else {
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
