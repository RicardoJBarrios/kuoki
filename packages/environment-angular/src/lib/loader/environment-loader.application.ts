import { Inject, Injectable, Optional } from '@angular/core';
import {
  DefaultEnvironmentLoader as OriginalEnvironmentLoader,
  EnvironmentService,
  EnvironmentSource
} from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { ENVIRONMENT_SOURCES_FACTORY } from '../source';

@Injectable()
export class DefaultEnvironmentLoader extends OriginalEnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,

    @Optional()
    @Inject(ENVIRONMENT_SOURCES_FACTORY)
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
}
