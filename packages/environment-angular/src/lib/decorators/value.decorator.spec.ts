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

  @Value('b', { defaultValue })
  b2?: string;
}

describe('@Value(path,options?)', () => {
  let spectator: SpectatorService<TetsService>;

  const createService = createServiceFactory({
    service: TetsService,
    imports: [EnvironmentModule.forRoot({ initialState: { a: fromEnv } })]
  });

  beforeEach(() => {
    spectator = createService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`sets the value at instance level`, () => {
    const obj1 = new TetsService();
    const obj2 = new TetsService();
    obj2.a = fromValue;
    obj2.a2 = fromValue;
    obj2.b = fromValue;
    obj2.b2 = fromValue;

    expect(obj1.a).toEqual(fromEnv);
    expect(obj1.a2).toEqual(fromValue);
    expect(obj1.b).toBeUndefined();
    expect(obj1.b2).toEqual(defaultValue);

    expect(obj2.a).toEqual(fromValue);
    expect(obj2.a2).toEqual(fromValue);
    expect(obj2.b).toEqual(fromValue);
    expect(obj2.b2).toEqual(fromValue);

    expect(obj1.a).toEqual(fromEnv);
    expect(obj1.a2).toEqual(fromValue);
    expect(obj1.b).toBeUndefined();
    expect(obj1.b2).toEqual(defaultValue);
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
    expect(spectator.service.a2).toEqual(fromValue);
    spectator.service.a2 = undefined;
    expect(spectator.service.a2).toEqual(fromEnv);
  });

  it(`returns undefined if path not in environment`, () => {
    expect(spectator.service.b).toBeUndefined();
  });

  it(`uses config to resolve the value`, () => {
    expect(spectator.service.b2).toEqual(defaultValue);
  });
});
