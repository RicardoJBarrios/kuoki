import { Inject, Injectable, Optional } from '@angular/core';
import {
  DefaultEnvironmentLoader,
  DefaultEnvironmentQuery,
  DefaultEnvironmentService,
  EnvironmentQueryConfig,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentState,
  EnvironmentStore
} from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { ENVIRONMENT_QUERY_CONFIG } from '../query';
import { ENVIRONMENT_SOURCES } from '../source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_STATE } from '../store';

@Injectable()
export class CustomEnvironmentStore extends DefaultEnvironmentStore {
  constructor(
    @Optional()
    @Inject(ENVIRONMENT_INITIAL_STATE)
    protected override readonly _initialState?: EnvironmentState
  ) {
    super(_initialState);
  }
}

@Injectable()
export class CustomEnvironmentService extends DefaultEnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
}

@Injectable()
export class CustomEnvironmentQuery extends DefaultEnvironmentQuery {
  constructor(
    protected override readonly store: EnvironmentStore,
    @Optional()
    @Inject(ENVIRONMENT_QUERY_CONFIG)
    protected override readonly queryConfig?: EnvironmentQueryConfig | null
  ) {
    super(store, queryConfig);
  }
}

@Injectable()
export class CustomEnvironmentLoader extends DefaultEnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,
    @Optional()
    @Inject(ENVIRONMENT_SOURCES)
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
}

@Injectable({ providedIn: 'root' })
export class NoRequiredSource implements EnvironmentSource {
  id = 'NoRequiredSource';
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

@Injectable({ providedIn: 'root' })
export class RequiredSource implements EnvironmentSource {
  id = 'RequiredSource';
  isRequired = true;
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}
