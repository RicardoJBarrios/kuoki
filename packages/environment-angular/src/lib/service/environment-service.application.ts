import { Injectable } from '@angular/core';
import { EnvironmentService, EnvironmentStore } from '@kuoki/environment';

@Injectable()
export class DefaultEnvironmentService extends EnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
}
