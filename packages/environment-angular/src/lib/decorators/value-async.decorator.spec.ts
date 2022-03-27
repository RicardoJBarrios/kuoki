import { Injectable } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { ValueAsync } from './value-async.decorator';

const fromEnv = 'fromEnv';
const fromValue = 'fromValue';
const defaultValue = 'defaultValue';

@Injectable()
class TetsService {
  @ValueAsync('a')
  a?: Promise<string>;

  @ValueAsync('a')
  a2?: Promise<string> = Promise.resolve(fromValue);

  @ValueAsync('b')
  b?: Promise<string>;

  @ValueAsync('b', { defaultValue })
  b2?: any;
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

  it(`returns undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.a).toBeUndefined();
  });

  it(`returns the environment value as Promise if property is undefined`, async () => {
    await expect(spectator.service.a).resolves.toEqual(fromEnv);
  });

  it(`returns the property value as Promise if is defined`, async () => {
    await expect(spectator.service.a2).resolves.toEqual(fromValue);
  });

  it(`returns the environment value as Promise if property is set to undefined again`, async () => {
    spectator.service.a2 = undefined;
    await expect(spectator.service.a2).resolves.toEqual(fromEnv);
  });

  it(`returns unresolvable Promise if path not in environment`, async () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    spectator.service.b?.then(spy);
    jest.advanceTimersByTime(1000);
    expect(spy).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it(`uses config to resolve the value`, async () => {
    await expect(spectator.service.b2).resolves.toEqual(defaultValue);
  });

  it(`throws if tries to set a non Promise value`, () => {
    expect(() => (spectator.service.b2 = 'a')).toThrowWithMessage(TypeError, `b2 must be a PromiseLike`);
  });
});
