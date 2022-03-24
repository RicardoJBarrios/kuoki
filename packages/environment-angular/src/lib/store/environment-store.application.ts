import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentState, EnvironmentStore } from '@kuoki/environment';
import { BehaviorSubject, Observable } from 'rxjs';

import { ENVIRONMENT_INITIAL_STATE } from './environment-initial-state.token';

/**
 * Stores the environment properties that the application needs.
 */
@Injectable()
export class DefaultEnvironmentStore implements EnvironmentStore {
  /**
   * The initial environment state.
   */
  protected readonly initialState = this._initialState ?? {};

  /**
   * The environment state.
   */
  protected readonly state: BehaviorSubject<EnvironmentState> = new BehaviorSubject(this.initialState);

  /**
   * Stores the environment properties that the application needs.
   * @param _initialState The initial environment state.
   */
  constructor(@Optional() @Inject(ENVIRONMENT_INITIAL_STATE) protected readonly _initialState?: EnvironmentState) {}

  getAll$(): Observable<EnvironmentState> {
    return this.state.asObservable();
  }

  getAll(): EnvironmentState {
    return this.state.getValue();
  }

  update(environment: EnvironmentState): void {
    this.state.next(environment);
  }

  reset(): void {
    this.state.next(this.initialState);
  }
}
