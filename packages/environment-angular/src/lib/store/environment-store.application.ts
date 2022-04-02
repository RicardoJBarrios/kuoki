import { Inject, Injectable, Optional } from '@angular/core';
import { DefaultEnvironmentStore as OriginalEnvironmentStore, EnvironmentState } from '@kuoki/environment';

import { ENVIRONMENT_INITIAL_STATE } from './environment-initial-state.token';

@Injectable()
export class DefaultEnvironmentStore extends OriginalEnvironmentStore {
  constructor(
    @Optional()
    @Inject(ENVIRONMENT_INITIAL_STATE)
    protected override readonly _initialState?: EnvironmentState
  ) {
    super(_initialState);
  }
}
