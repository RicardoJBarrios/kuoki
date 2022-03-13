import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentQuery, EnvironmentQueryConfig, EnvironmentStore } from '@kuoki/environment';

import { ENVIRONMENT_STORE } from '../store';
import { ENVIRONMENT_QUERY_CONFIG } from './environment-query-config.token';

@Injectable()
export class DefaultEnvironmentQuery extends EnvironmentQuery {
  constructor(
    @Inject(ENVIRONMENT_STORE) protected override readonly store: EnvironmentStore,
    @Optional() @Inject(ENVIRONMENT_QUERY_CONFIG) protected override readonly queryConfig?: EnvironmentQueryConfig
  ) {
    super(store, queryConfig);
  }
}
