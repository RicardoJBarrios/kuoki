import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentLoader, EnvironmentService, EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { ENVIRONMENT_SERVICE } from '../service';
import { ENVIRONMENT_SOURCES } from '../source';

@Injectable()
export class DefaultEnvironmentLoader extends EnvironmentLoader {
  constructor(
    @Inject(ENVIRONMENT_SERVICE) protected override readonly service: EnvironmentService,
    @Optional() @Inject(ENVIRONMENT_SOURCES) protected override readonly sources?: ArrayOrSingle<EnvironmentSource>
  ) {
    super(service, sources);
  }
}
