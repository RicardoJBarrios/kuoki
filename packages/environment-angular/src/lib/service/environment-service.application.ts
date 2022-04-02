import { Injectable } from '@angular/core';
import { DefaultEnvironmentService as OriginalEnvironmentService, EnvironmentStore } from '@kuoki/environment';

@Injectable()
export class DefaultEnvironmentService extends OriginalEnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
}
