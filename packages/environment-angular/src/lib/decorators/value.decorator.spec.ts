import { Injectable } from '@angular/core';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { Value } from './value.decorator';

const fromEnv = 'fromEnv';
const fromValue = 'fromValue';
const defaultValue = 'defaultValue';

@Injectable()
class TetsService {
  @Value('a')
  a?: string;

  @Value('a')
  a2?: string = fromValue;

  @Value('b')
  b?: string;

  @Value('c', { defaultValue })
  c?: string;
}

describe('@Value(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;

  const createService = createServiceFactory({
    service: TetsService,
    imports: [EnvironmentModule.forRoot({ initialValue: { a: fromEnv } })]
  });

  beforeEach(() => {
    spectator = createService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`returns undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.a).toBeUndefined();
  });

  it(`returns the environment value if property is undefined`, () => {
    expect(spectator.service.a).toEqual(fromEnv);
  });

  it(`returns the property value if is defined`, () => {
    expect(spectator.service.a2).toEqual(fromValue);
  });

  it(`returns the environment value if property is set to undefined again`, () => {
    spectator.service.a2 = undefined;
    expect(spectator.service.a2).toEqual(fromEnv);
  });

  it(`returns undefined if path not in environment`, () => {
    expect(spectator.service.b).toBeUndefined();
  });

  it(`uses config to resolve the value`, () => {
    expect(spectator.service.c).toEqual(defaultValue);
  });
});
