import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentState, EnvironmentStore } from '@kuoki/environment';
import { BehaviorSubject, Observable } from 'rxjs';

import { ENVIRONMENT_INITIAL_VALUE } from './environment-initial-value.token';

@Injectable()
export class DefaultEnvironmentStore implements EnvironmentStore {
  protected readonly calculatedInitialState = this.initialState ?? {};
  protected readonly state: BehaviorSubject<EnvironmentState> = new BehaviorSubject(this.calculatedInitialState);

  constructor(@Optional() @Inject(ENVIRONMENT_INITIAL_VALUE) protected readonly initialState: EnvironmentState) {}

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
    this.state.next(this.calculatedInitialState);
  }
}
