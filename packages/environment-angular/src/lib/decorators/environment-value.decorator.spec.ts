import { Injectable } from '@angular/core';
import { EnvironmentReferenceError, EnvironmentService, Property } from '@kuoki/environment';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';

import { EnvironmentModule } from '../module';
import { EnvironmentValue } from './environment-value.decorator';

const initialState = { a: 0, b: 'v{{a}}' };

@Injectable()
class TetsService {
  @EnvironmentValue('a')
  a?: number;

  @EnvironmentValue('a')
  b: number = 1;

  @EnvironmentValue('z')
  c?: number;

  @EnvironmentValue('z', { defaultValue: 1 })
  d!: number;

  @EnvironmentValue('a', { targetType: (v?: number) => (v ?? 0) + 1 })
  e!: number;

  @EnvironmentValue('b', { transpile: { a: 0 } })
  f?: string;

  @EnvironmentValue('b', { transpile: {}, config: { transpileEnvironment: true } })
  g?: string;

  @EnvironmentValue('a', { required: true })
  h!: string;

  @EnvironmentValue('z', { required: true })
  i!: string;

  @EnvironmentValue('a', { static: false })
  j?: number;

  private _getter?: number = undefined;

  @EnvironmentValue('a')
  get getter(): number | undefined {
    return this._getter;
  }

  set getter(value: number | undefined) {
    this._getter = value;
  }

  private _setter?: number = undefined;

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

  it(`sets undefined if no EnvironmentQuery`, () => {
    jest.spyOn(EnvironmentModule, 'query', 'get').mockReturnValue(undefined);
    expect(spectator.service.a).toBeUndefined();
    jest.restoreAllMocks();
  });

  it(`sets the property with the environment value`, () => {
    expect(spectator.service.a).toEqual(0);
  });

  it(`ignores environment value if property is defined`, () => {
    expect(spectator.service.b).toEqual(1);
  });

  it(`sets undefined if no environment value`, () => {
    expect(spectator.service.c).toBeUndefined();
  });

  it(`sets the property with defaultValue`, () => {
    expect(spectator.service.d).toEqual(1);
  });

  it(`sets the property with targetType`, () => {
    expect(spectator.service.e).toEqual(1);
  });

  it(`sets the property with transpile`, () => {
    expect(spectator.service.f).toEqual('v0');
  });

  it(`sets the property with transpile`, () => {
    expect(spectator.service.g).toEqual('v0');
  });

  it(`sets the property with required`, () => {
    expect(spectator.service.h).toEqual(0);
  });

  it(`throws error if the path doesn't exist and required`, () => {
    expect(() => spectator.service.i).toThrowWithMessage(
      EnvironmentReferenceError,
      'The environment property "z" is not defined'
    );
  });

  it(`sets the property with static=true (default)`, () => {
    const service = spectator.inject(EnvironmentService);
    expect(spectator.service.a).toEqual(0);
    service.update('a', 1);
    expect(spectator.service.a).toEqual(0);
  });

  it(`sets the property with static=false`, () => {
    const service = spectator.inject(EnvironmentService);
    expect(spectator.service.j).toEqual(0);
    service.update('a', 1);
    expect(spectator.service.j).toEqual(1);
  });

  it(`gets the property from getter`, () => {
    expect(spectator.service.getter).toEqual(0);
  });

  it(`gets the property from setter`, () => {
    expect(spectator.service.setter).toEqual(0);
  });

  it(`ignores the property from method`, () => {
    expect(spectator.service.method()).toBeUndefined();
  });

  it(`sets the value at instance level`, () => {
    const obj1 = new TetsService();
    const obj2 = new TetsService();

    expect(obj1.a).toEqual(0);
    expect(obj2.a).toEqual(0);

    obj2.a = 1;
    expect(obj1.a).toEqual(0);
    expect(obj2.a).toEqual(1);

    obj2.a = undefined;
    expect(obj1.a).toEqual(0);
    expect(obj2.a).toEqual(0);
  });
});
