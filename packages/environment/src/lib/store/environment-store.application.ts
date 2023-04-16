import { BehaviorSubject, Observable } from 'rxjs';

import { EnvironmentState } from './environment-state.type';
import { EnvironmentStore } from './environment-store.interface';

/**
 * Stores the properties that the application needs using BehaviorSubject as store.
 */
export class DefaultEnvironmentStore implements EnvironmentStore {
  /**
   * The EnvironmentState store.
   */
  protected readonly state: BehaviorSubject<EnvironmentState> = new BehaviorSubject(this.initialState);

  /**
   * Stores the properties that the application needs using BehaviorSubject as store.
   * @param _initialState The initial EnvironmentState state.
   */
  constructor(protected readonly initialState: EnvironmentState = {}) {}

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
