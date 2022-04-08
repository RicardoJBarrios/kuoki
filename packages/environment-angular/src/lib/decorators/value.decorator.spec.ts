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

  private _c?: string;

  @Value('a')
  get c(): string | undefined {
    return this._c;
  }

  set c(value: string | undefined) {
    this._c = value;
  }

  private _d?: string;

  get d(): string | undefined {
    return this._d;
  }

  @Value('a')
  set d(value: string | undefined) {
    this._d = value;
  }

  e = 0;

  @Value('a')
  method(): string | undefined {
    return undefined;
  }
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
    obj2.c = fromValue;
    obj2.d = fromValue;

    expect(obj1.a).toEqual(fromEnv);
    expect(obj1.a2).toEqual(fromValue);
    expect(obj1.b).toBeUndefined();
    expect(obj1.b2).toEqual(defaultValue);
    expect(obj1.c).toEqual(fromEnv);
    expect(obj1.d).toEqual(fromEnv);

    expect(obj2.a).toEqual(fromValue);
    expect(obj2.a2).toEqual(fromValue);
    expect(obj2.b).toEqual(fromValue);
    expect(obj2.b2).toEqual(fromValue);
    expect(obj2.c).toEqual(fromValue);
    expect(obj2.d).toEqual(fromValue);

    obj2.a = undefined;
    obj2.a2 = undefined;
    obj2.b = undefined;
    obj2.b2 = undefined;
    obj2.c = undefined;
    obj2.d = undefined;

    expect(obj1.a).toEqual(fromEnv);
    expect(obj1.a2).toEqual(fromValue);
    expect(obj1.b).toBeUndefined();
    expect(obj1.b2).toEqual(defaultValue);
    expect(obj1.c).toEqual(fromEnv);
    expect(obj1.d).toEqual(fromEnv);

    expect(obj2.a).toEqual(fromEnv);
    expect(obj2.a2).toEqual(fromEnv);
    expect(obj2.b).toBeUndefined();
    expect(obj2.b2).toEqual(defaultValue);
    expect(obj2.c).toEqual(fromEnv);
    expect(obj2.d).toEqual(fromEnv);
  });

  it(`sets undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.a).toBeUndefined();
  });

  it(`sets the environment value at path if property is undefined`, () => {
    expect(spectator.service.a).toEqual(fromEnv);
  });

  it(`sets the environment value at path if property is undefined in getter`, () => {
    expect(spectator.service.c).toEqual(fromEnv);
  });

  it(`sets the environment value at path if property is undefined in setter`, () => {
    expect(spectator.service.d).toEqual(fromEnv);
  });

  it(`do not changes the property if value is defined`, () => {
    expect(spectator.service.a2).toEqual(fromValue);
  });

  it(`sets the environment value at path if property is set to undefined again`, () => {
    expect(spectator.service.a2).toEqual(fromValue);
    spectator.service.a2 = undefined;
    expect(spectator.service.a2).toEqual(fromEnv);
  });

  it(`sets undefined if path is not in environment`, () => {
    expect(spectator.service.b).toBeUndefined();
  });

  it(`uses config to resolve the value`, () => {
    expect(spectator.service.b2).toEqual(defaultValue);
  });

  it(`ignores decorated methods`, () => {
    expect(spectator.service.method()).toBeUndefined();
  });
});
