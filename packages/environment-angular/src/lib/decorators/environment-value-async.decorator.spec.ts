import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { EnvironmentValueAsync } from './environment-value-async.decorator';

const fromEnv = 0;
const initialState = { a: fromEnv };

@Injectable()
class TetsService {
  @EnvironmentValueAsync('a')
  envValue?: Promise<number>;
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

  it(`sets undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.envValue).toBeUndefined();
  });

  it(`sets the environment value at path as Promise if property value is undefined`, async () => {
    await expect(spectator.service.envValue).resolves.toEqual(fromEnv);
  });
});
