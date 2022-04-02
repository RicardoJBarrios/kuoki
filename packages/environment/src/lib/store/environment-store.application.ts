import { BehaviorSubject, Observable } from 'rxjs';

import { EnvironmentState } from './environment-state.type';
import { EnvironmentStore } from './environment-store.gateway';

/**
 * Stores the environment properties that the application needs using a basic RxJS implementation.
 */
export class DefaultEnvironmentStore implements EnvironmentStore {
  /**
   * The initial environment state.
   */
  protected readonly initialState = this._initialState ?? {};

  /**
   * The environment state.
   */
  protected readonly state: BehaviorSubject<EnvironmentState> = new BehaviorSubject(this.initialState);

  constructor(protected readonly _initialState?: EnvironmentState) {}

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
