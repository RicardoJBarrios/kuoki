/* eslint-disable @typescript-eslint/no-unused-vars */
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
  tap,
} from 'rxjs';
import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { EnvironmentState } from '../store';
import { environmentSourcesFactory } from './environment-sources-factory.function';
import { lifecycleHook } from './lifecycle-hook.function';

/**
 * Loads the environment properties from the provided asynchronous sources.
 */
export class EnvironmentLoader {
  protected readonly loadSubject$: ReplaySubject<void> = new ReplaySubject();
  protected readonly requiredToLoadSubject$: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  protected readonly sourcesSubject$: Map<string, ReplaySubject<void>> = new Map();
  protected readonly loaderSources: ReadonlyArray<Required<EnvironmentSource>>;

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @param service Sets properties in the environment store.
   * @param sources The environment properties sources to get the application properties asynchronously.
   */
  constructor(
    protected readonly service: EnvironmentService,
    protected readonly sources?: ArrayOrSingle<EnvironmentSource>,
  ) {
    this.loaderSources = environmentSourcesFactory(this.sources);
    this.loaderSources.forEach((source: Required<EnvironmentSource>) => {
      this.sourcesSubject$.set(source.id, new ReplaySubject());
    });
  }

  /**
   * Loads the environment properties from the provided asynchronous sources.
   * @returns A promise to load once the `requiredToLoad` sources are loaded.
   */
  async load(): Promise<void> {
    lifecycleHook(this, 'onBeforeLoad');

    this._watchRequiredToLoadSources();
    this._loadSources();

    return firstValueFrom(this.loadSubject$)
      .then(() => {
        lifecycleHook(this, 'onAfterLoad');
        Promise.resolve();
      })
      .catch(<E>(error: E) => {
        lifecycleHook(this, 'onAfterError', error);
        throw error;
      })
      .finally(() => this.onDestroy());
  }

  private _watchRequiredToLoadSources(): void {
    const requiredToLoadSources: Set<string> = new Set(
      this.loaderSources
        .filter((source: Required<EnvironmentSource>) => source.requiredToLoad)
        .map((source: Required<EnvironmentSource>) => source.id),
    );

    this.requiredToLoadSubject$
      .pipe(
        filter((requiredToLoadLoaded: Set<string>) => isEqual(requiredToLoadLoaded, requiredToLoadSources)),
        tap({ next: () => this.resolveLoad() }),
        take(1),
      )
      .subscribe();
  }

  private _loadSources(): void {
    merge(this._loadOrderedSources(), this._loadUnorderedSources())
      .pipe(finalize(() => lifecycleHook(this, 'onAfterComplete')))
      .subscribe();
  }

  private _loadOrderedSources(): Observable<EnvironmentState> {
    const orderedSources: Required<EnvironmentSource>[] = this.loaderSources.filter(
      (source: Required<EnvironmentSource>) => source.loadInOrder,
    );
    const orderedSources$: Observable<EnvironmentState>[] = this._getSources$(orderedSources);

    return concat(...orderedSources$);
  }

  private _loadUnorderedSources(): Observable<EnvironmentState> {
    const unorderedSources: Required<EnvironmentSource>[] = this.loaderSources.filter(
      (source: Required<EnvironmentSource>) => !source.loadInOrder,
    );
    const unorderedSources$: Observable<EnvironmentState>[] = this._getSources$(unorderedSources);

    return merge(...unorderedSources$);
  }

  private _getSources$(sources: Required<EnvironmentSource>[]): Observable<EnvironmentState>[] {
    return sources.map((source: Required<EnvironmentSource>) => {
      return defer(() => {
        lifecycleHook(this, 'onBeforeSourceLoad', source);

        return source.load();
      }).pipe(
        tap({
          next: (properties: EnvironmentState) => {
            lifecycleHook(this, 'onBeforeSourceAdd', properties, source);
            const modifiedProperties: EnvironmentState = this.preAddProperties(properties, source);
            this._saveSourceValueToStore(modifiedProperties, source);
            lifecycleHook(this, 'onAfterSourceAdd', modifiedProperties, source);
          },
        }),
        catchError(<E>(error: E) => this._checkSourceLoadError(error, source)),
        finalize(() => {
          lifecycleHook(this, 'onAfterSourceComplete', source);
          this._checkRequiredToLoad(source);
        }),
        takeUntil(this._getSafeSourceSubject$(source.id)),
      );
    });
  }

  /**
   * Middleware function that gives the possibility to modify the source properties before inserting it into the environment.
   * @param properties The source properties.
   * @param source The environment properties source.
   * @returns The modified source properties.
   */
  preAddProperties(properties: EnvironmentState, source?: Required<EnvironmentSource>): EnvironmentState {
    return properties;
  }

  private _saveSourceValueToStore(properties: EnvironmentState, source: Required<EnvironmentSource>): void {
    if (source.mergeProperties) {
      this.service.merge(properties, source.path);
    } else {
      this.service.add(properties, source.path);
    }
  }

  private _checkSourceLoadError<E>(error: E, source: Required<EnvironmentSource>): Observable<EnvironmentState> {
    const newError: Error = this._getError(error);
    const sourceId: string = source.name ?? source.id;
    const originalMessage: string = newError.message ? `: ${newError.message}` : '';
    newError.message = `The Environment EnvironmentSource "${sourceId}" failed to load${originalMessage}`;

    lifecycleHook(this, 'onAfterSourceError', newError, source);

    if (source.requiredToLoad && !source.ignoreError && !this.loadSubject$.isStopped) {
      this.rejectLoad(newError);
    }

    return of({});
  }

  private _getError<E>(error: E): Error {
    if (error instanceof Error) {
      return error;
    }

    const newError = new Error();
    newError.message = String(error);

    return newError;
  }

  private _checkRequiredToLoad(source: Required<EnvironmentSource>): void {
    if (source.requiredToLoad) {
      const requiredToLoadLoaded: Set<string> = this.requiredToLoadSubject$.getValue().add(source.id);

      this.requiredToLoadSubject$.next(requiredToLoadLoaded);
    }
  }

  private _getSafeSourceSubject$(id: string): ReplaySubject<void> {
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
    this.loaderSources.forEach((source: Required<EnvironmentSource>) => this.completeSource(source));
  }

  /**
   * Completes a source load.
   * @param id The id of the source to complete.
   */
  completeSource(source: Required<EnvironmentSource>): void {
    const sourceSubject$: ReplaySubject<void> | undefined = this.sourcesSubject$.get(source.id);

    if (sourceSubject$ != null) {
      sourceSubject$.next();
      this._checkRequiredToLoad(source);
    }
  }

  /**
   * Forces the load to resolve, stops all ongoing source loads and completes the subjects.
   */
  onDestroy(): void {
    this.completeAllSources();
    this.loadSubject$.complete();
    this.requiredToLoadSubject$.complete();
    this.sourcesSubject$.forEach((subject: ReplaySubject<void>) => subject.complete());
  }
}
