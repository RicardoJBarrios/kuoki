import { Injectable } from '@angular/core';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { EnvironmentPrefix } from './environment-prefix.decorator';
import { EnvironmentValue } from './environment-value.decorator';

const fromEnv = 0;
const initialState = { a: { a: fromEnv } };

@Injectable()
@EnvironmentPrefix('a')
class TetsService {
  @EnvironmentValue('a')
  envValue?: number;
}

describe('@EnvironmentPrefix(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;

  const createService = createServiceFactory({
    service: TetsService,
    imports: [EnvironmentModule.forRoot({ initialState })]
  });

  beforeEach(() => {
    spectator = createService();
  });

  it(`sets the environment value at path if property value is undefined using the environment prefix`, () => {
    expect(spectator.service.envValue).toEqual(fromEnv);
  });
});
