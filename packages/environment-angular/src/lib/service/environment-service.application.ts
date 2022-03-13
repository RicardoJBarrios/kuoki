import { Inject, Injectable } from '@angular/core';
import { EnvironmentService, EnvironmentStore } from '@kuoki/environment';

import { ENVIRONMENT_STORE } from '../store';

@Injectable()
export class DefaultEnvironmentService extends EnvironmentService {
  constructor(@Inject(ENVIRONMENT_STORE) protected override readonly store: EnvironmentStore) {
    super(store);
  }
}
