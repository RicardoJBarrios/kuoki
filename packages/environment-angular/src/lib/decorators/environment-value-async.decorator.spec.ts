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

  @EnvironmentValueAsync('b', { dueTime: 10 })
  noValue?: Promise<number>;
}

describe('@EnvironmentValueAsync(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;

  const createService = createServiceFactory({
    service: TetsService,
    imports: [EnvironmentModule.forRoot({ initialState })]
  });

  beforeEach(() => {
    spectator = createService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`sets undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.envValue).toBeUndefined();
  });

  it(`sets the environment value at path as Promise`, async () => {
    await expect(spectator.service.envValue).resolves.toEqual(fromEnv);
  });

  it(`sets undefined as Promise if path doesn't exist and dueTime`, async () => {
    await expect(spectator.service.noValue).resolves.toBeUndefined();
  });
});
