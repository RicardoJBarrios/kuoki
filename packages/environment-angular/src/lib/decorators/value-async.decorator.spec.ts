import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { ValueAsync } from './value-async.decorator';

const fromEnv = 'fromEnv';
const defaultValue = 'defaultValue';

@Injectable()
class TetsService {
  @ValueAsync('a')
  a?: Promise<string>;

  @ValueAsync('b', { defaultValue })
  b?: Promise<string>;
}

describe('@ValueAsync(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;
  let query: SpyObject<EnvironmentQuery>;

  const createService = createServiceFactory({
    service: TetsService,
    imports: [EnvironmentModule.forRoot({ initialState: { a: fromEnv } })]
  });

  beforeEach(() => {
    spectator = createService();
    query = spectator.inject(EnvironmentQuery);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`returns the environment value as Promise if property is undefined`, async () => {
    await expect(spectator.service.a).resolves.toEqual(fromEnv);
  });

  it(`returns the environment value as Promise using options`, async () => {
    await expect(spectator.service.b).resolves.toEqual(defaultValue);
  });
});
