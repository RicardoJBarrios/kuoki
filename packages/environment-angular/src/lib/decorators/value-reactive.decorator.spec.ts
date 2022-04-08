import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, Subscription } from 'rxjs';

import { EnvironmentModule } from '../module';
import { Value$ } from './value-reactive.decorator';

const fromEnv = 'fromEnv';
const defaultValue = 'defaultValue';

@Injectable()
class TetsService {
  @Value$<string>('a')
  a?: Observable<string>;

  @Value$('b', { defaultValue })
  b?: Observable<string>;
}

describe('@Value$(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;
  let query: SpyObject<EnvironmentQuery>;
  let sub: Subscription | undefined;

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
    sub?.unsubscribe();
  });

  it(`returns the environment value as Observable if property is undefined`, (done) => {
    sub = spectator.service.a?.subscribe((v) => {
      expect(v).toEqual(fromEnv);
      done();
    });
  });

  it(`returns the environment value as Observable using options`, (done) => {
    sub = spectator.service.b?.subscribe((v) => {
      expect(v).toEqual(defaultValue);
      done();
    });
  });
});
