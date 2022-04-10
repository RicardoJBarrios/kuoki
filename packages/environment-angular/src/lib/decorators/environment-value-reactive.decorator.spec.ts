import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, Subscription } from 'rxjs';

import { EnvironmentModule } from '../module';
import { EnvironmentValue$ } from './environment-value-reactive.decorator';

const fromEnv = 0;
const initialState = { a: fromEnv };

@Injectable()
class TetsService {
  @EnvironmentValue$('a')
  envValue?: Observable<number>;
}

describe('@EnvironmentValue$(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;
  let query: SpyObject<EnvironmentQuery>;
  let sub: Subscription | undefined;

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
    sub?.unsubscribe();
  });

  it(`sets undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.envValue).toBeUndefined();
  });

  it(`sets the environment value at path as Observable if property value is undefined`, (done) => {
    sub = spectator.service.envValue?.subscribe((v) => {
      expect(v).toEqual(fromEnv);
      done();
    });
  });
});
