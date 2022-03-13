import { Injectable } from '@angular/core';
import { EnvironmentState, EnvironmentStore } from '@kuoki/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DefaultEnvironmentStore implements EnvironmentStore {
  protected readonly initialState: EnvironmentState = {};
  protected readonly state: BehaviorSubject<EnvironmentState> = new BehaviorSubject(this.initialState);

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
