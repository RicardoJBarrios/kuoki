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

import { EnvironmentService } from '../service';
import { EnvironmentSource, SourceStrategy } from '../source';
import { EnvironmentState } from '../store';
import { environmentSourcesFactory } from './environment-sources-factory.function';
import { lifecycleHook } from './lifecycle-hook.function';
import { LoaderSource } from './loader-source.type';

/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Loads the environment properties from the provided asynchronous sources.
 */
export class EnvironmentLoader {
  protected readonly loadSubject$: ReplaySubject<void> = new ReplaySubject();
  protected readonly isRequiredSubject$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  protected readonly sourcesSubject$: Map<string, ReplaySubject<void>> = new Map();
  protected readonly loaderSources: ReadonlyArray<LoaderSource>;
  protected isLoading = false;

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @param service Sets properties in the environment store.
   * @param sources The environment properties sources to get the application properties asynchronously.
   */
  constructor(
    protected readonly service: EnvironmentService,
    protected readonly sources?: ArrayOrSingle<EnvironmentSource>
  ) {
    this.loaderSources = environmentSourcesFactory(this.sources);
    this.loaderSources.forEach((source: LoaderSource) => {
      this.sourcesSubject$.set(source.id, new ReplaySubject());
    });
  }

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @returns A promise once the `isRequired` sources are loaded.
   * @example
   * ```js
   * loader.load().then(() => {})
   * ```
   */
  async load(): Promise<void> {
    lifecycleHook(this, 'onBeforeLoad');
    this.isLoading = true;

    this.watchRequiredToLoadSources();
    this.loadSources();

    return firstValueFrom(this.loadSubject$)
      .then(() => {
        lifecycleHook(this, 'onAfterLoad');
        Promise.resolve();
      })
      .catch(<E>(error: E) => {
        lifecycleHook(this, 'onAfterError', error);
        throw error;
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
        takeUntil(this.getSafeSourceSubject$(source.id))
      );
    });
  }

  /**
   * Middleware function that gives the possibility to modify the source properties before inserting it into the environment.
   * @param properties The source properties.
   * @param source The environment properties source.
   * @returns The modified source properties.
   */
  preAddProperties(properties: EnvironmentState, source?: LoaderSource): EnvironmentState {
    return properties;
  }

  protected saveSourceValueToStore(properties: EnvironmentState, source: LoaderSource): void {
    if (source.strategy === SourceStrategy.MERGE) {
      this.service.merge(properties, source.path);
    } else {
      this.service.add(properties, source.path);
    }
  }

  protected checkSourceLoadError<E>(error: E, source: LoaderSource): Observable<EnvironmentState> {
    const newError: Error = this.getError(error);
    const originalMessage: string = newError.message ? `: ${newError.message}` : '';
    newError.message = `The Environment EnvironmentSource "${source.id}" failed to load${originalMessage}`;

    lifecycleHook(this, 'onAfterSourceError', newError, source);

    if (source.isRequired && !source.ignoreError && this.isLoading) {
      this.rejectLoad(newError);
    }

    return of({});
  }

  protected getError<E>(error: E): Error {
    if (error instanceof Error) {
      return error;
    }

    const newError = new Error();
    newError.message = String(error);

    return newError;
  }

  protected checkRequiredToLoad(source: LoaderSource): void {
    if (source.isRequired) {
      const isRequiredLoaded: Set<string> = this.isRequiredSubject$.getValue().add(source.id);

      this.isRequiredSubject$.next(isRequiredLoaded);
    }
  }

  protected getSafeSourceSubject$(id: string): ReplaySubject<void> {
    let subject: ReplaySubject<void> | undefined = this.sourcesSubject$.get(id);

    if (subject === undefined) {
      subject = new ReplaySubject();
      this.sourcesSubject$.set(id, subject);
    }

    return subject;
  }

  /**
   * Forces the load to resolve.
   */
  resolveLoad(): void {
    this.loadSubject$.next();
  }

  /**
   * Forces the load to reject.
   */
  rejectLoad<E>(error: E): void {
    this.loadSubject$.error(error);
  }

  /**
   * Forces the load to resolve and stops all ongoing source loads.
   */
  completeAllSources(): void {
    this.loaderSources.forEach((source: LoaderSource) => this.completeSource(source));
  }

  /**
   * Completes a source load.
   * @param id The id of the source to complete.
   */
  completeSource(source: LoaderSource): void {
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
