import { Injectable } from '@angular/core';
import { EnvironmentService, Property } from '@kuoki/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { EnvironmentValue } from './environment-value.decorator';

const fromEnv = 0;
const fromValue = 1;
const defaultValue = '9';
const targetType = (v: Property) => parseInt(String(v), 10);
const getOptionsValue = 9;
const initialState = { a: fromEnv };

@Injectable()
class TetsService {
  @EnvironmentValue('a')
  envValue?: number;

  @EnvironmentValue('a')
  propValue?: number = fromValue;

  @EnvironmentValue('b')
  noEnvValue?: number;

  @EnvironmentValue('b', { defaultValue, targetType })
  getOptions?: number;

  @EnvironmentValue('a', { static: false })
  decoratorOptions?: number;

  private _getter?: number;

  @EnvironmentValue('a')
  get getter(): number | undefined {
    return this._getter;
  }

  set getter(value: number | undefined) {
    this._getter = value;
  }

  private _setter?: number;

  get setter(): number | undefined {
    return this._setter;
  }

  @EnvironmentValue('a')
  set setter(value: number | undefined) {
    this._setter = value;
  }

  @EnvironmentValue('a')
  method(): number | undefined {
    return undefined;
  }
}

describe('@EnvironmentValue(path,options?)', () => {
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

  it(`sets the value at instance level`, () => {
    const obj1 = new TetsService();
    const obj2 = new TetsService();
    obj2.envValue = fromValue;
    obj2.propValue = fromValue;
    obj2.noEnvValue = fromValue;
    obj2.getOptions = fromValue;
    obj2.getter = fromValue;
    obj2.setter = fromValue;

    expect(obj1.envValue).toEqual(fromEnv);
    expect(obj1.propValue).toEqual(fromValue);
    expect(obj1.noEnvValue).toBeUndefined();
    expect(obj1.getOptions).toEqual(getOptionsValue);
    expect(obj1.getter).toEqual(fromEnv);
    expect(obj1.setter).toEqual(fromEnv);

    expect(obj2.envValue).toEqual(fromValue);
    expect(obj2.propValue).toEqual(fromValue);
    expect(obj2.noEnvValue).toEqual(fromValue);
    expect(obj2.getOptions).toEqual(fromValue);
    expect(obj2.getter).toEqual(fromValue);
    expect(obj2.setter).toEqual(fromValue);

    obj2.envValue = undefined;
    obj2.propValue = undefined;
    obj2.noEnvValue = undefined;
    obj2.getOptions = undefined;
    obj2.getter = undefined;
    obj2.setter = undefined;

    expect(obj1.envValue).toEqual(fromEnv);
    expect(obj1.propValue).toEqual(fromValue);
    expect(obj1.noEnvValue).toBeUndefined();
    expect(obj1.getOptions).toEqual(getOptionsValue);
    expect(obj1.getter).toEqual(fromEnv);
    expect(obj1.setter).toEqual(fromEnv);

    expect(obj2.envValue).toEqual(fromEnv);
    expect(obj2.propValue).toEqual(fromEnv);
    expect(obj2.noEnvValue).toBeUndefined();
    expect(obj2.getOptions).toEqual(getOptionsValue);
    expect(obj2.getter).toEqual(fromEnv);
    expect(obj2.setter).toEqual(fromEnv);
  });

  it(`sets undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.envValue).toBeUndefined();
  });

  it(`sets the environment value at path if property value is undefined`, () => {
    expect(spectator.service.envValue).toEqual(fromEnv);
  });

  it(`sets the environment value at path if accessor getter is undefined`, () => {
    expect(spectator.service.getter).toEqual(fromEnv);
    expect(spectator.service.setter).toEqual(fromEnv);
  });

  it(`do not changes the property if value is defined`, () => {
    expect(spectator.service.propValue).toEqual(fromValue);
  });

  it(`sets the environment value at path if property is set to undefined again`, () => {
    expect(spectator.service.propValue).toEqual(fromValue);
    spectator.service.propValue = undefined;
    expect(spectator.service.propValue).toEqual(fromEnv);
  });

  it(`sets undefined if path is not in environment`, () => {
    expect(spectator.service.noEnvValue).toBeUndefined();
  });

  it(`uses GetOptions to resolve the value`, () => {
    expect(spectator.service.getOptions).toEqual(getOptionsValue);
  });

  it(`uses {static:true} to resolve the value`, () => {
    const service = spectator.inject(EnvironmentService);
    expect(spectator.service.envValue).toEqual(fromEnv);
    service.update('a', fromValue);
    expect(spectator.service.envValue).toEqual(fromEnv);
  });

  it(`uses {static:false} to resolve the value`, () => {
    const service = spectator.inject(EnvironmentService);
    expect(spectator.service.decoratorOptions).toEqual(fromEnv);
    service.update('a', fromValue);
    expect(spectator.service.decoratorOptions).toEqual(fromValue);
  });

  it(`ignores decorated methods`, () => {
    expect(spectator.service.method()).toBeUndefined();
  });
});
