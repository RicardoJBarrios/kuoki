import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { Observable, of, Subscription } from 'rxjs';

import { EnvironmentModule } from '../module';
import { Value$ } from './value-reactive.decorator';

const fromEnv = 'fromEnv';
const fromValue = 'fromValue';
const defaultValue = 'defaultValue';

@Injectable()
class TetsService {
  @Value$('a')
  a?: Observable<string>;

  @Value$('a')
  a2?: Observable<string> = of(fromValue);

  @Value$('b')
  b?: Observable<string>;

  @Value$('c', { defaultValue })
  c?: Observable<string>;
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

  it(`returns undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.a).toBeUndefined();
  });

  it(`returns the environment value as Observable if property is undefined`, (done) => {
    sub = spectator.service.a?.subscribe((v) => {
      expect(v).toEqual(fromEnv);
      done();
    });
  });

  it(`returns the property value as Observable if is defined`, (done) => {
    sub = spectator.service.a2?.subscribe((v) => {
      expect(v).toEqual(fromValue);
      done();
    });
  });

  it(`returns the environment value as Observable if property is set to undefined again`, (done) => {
    spectator.service.a2 = undefined;
    sub = (spectator.service.a2 as any)?.subscribe((v: any) => {
      expect(v).toEqual(fromEnv);
      done();
    });
  });

  it(`returns undefined as Observable if path not in environment`, (done) => {
    sub = spectator.service.b?.subscribe((v) => {
      expect(v).toBeUndefined();
      done();
    });
  });

  it(`uses config to resolve the value`, (done) => {
    sub = spectator.service.c?.subscribe((v) => {
      expect(v).toEqual(defaultValue);
      done();
    });
  });
});
