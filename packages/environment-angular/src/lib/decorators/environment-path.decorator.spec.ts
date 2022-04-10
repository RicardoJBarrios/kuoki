import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';

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

describe('@EnvironmentValueAsync(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;
  let query: SpyObject<EnvironmentQuery>;

  const createService = createServiceFactory({
    service: TetsService,
    imports: [EnvironmentModule.forRoot({ initialState })]
  });

  beforeEach(() => {
    spectator = createService();
    query = spectator.inject(EnvironmentQuery);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`sets the environment value at path if property value is undefined`, () => {
    expect(spectator.service.envValue).toEqual(fromEnv);
  });
});
