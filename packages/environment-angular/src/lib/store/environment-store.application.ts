import { Inject, Injectable } from '@angular/core';
import { DefaultEnvironmentStore as OriginalEnvironmentStore, EnvironmentState } from '@kuoki/environment';

import { ENVIRONMENT_INITIAL_STATE } from './environment-initial-state.token';

@Injectable()
export class DefaultEnvironmentStore extends OriginalEnvironmentStore {
  constructor(
    @Inject(ENVIRONMENT_INITIAL_STATE)
    protected override readonly initialState: EnvironmentState = {}
  ) {
    super(initialState);
  }
}
