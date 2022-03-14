import { InjectionToken } from '@angular/core';

import { configProviderFactory } from './config-provider-factory.function';

class Provide {}
const token = new InjectionToken<Provide>('TOKEN');
function namedFn() {}
const fn = () => new Provide();

describe('getProvider({provide,defaultValue,configValue?,deps?,multi?})', () => {
  it(`returns Provider with configValue if defined`, () => {
    const input = { provide: Provide, configValue: token, defaultValue: Provide };
    const output = { provide: Provide, useExisting: token };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with defaultValue if configValue undefined`, () => {
    const input = { provide: Provide, defaultValue: token };
    const output = { provide: Provide, useExisting: token };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with defaultValue if configValue null`, () => {
    const input = { provide: Provide, configValue: null, defaultValue: token };
    const output = { provide: Provide, useExisting: token };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with deps if defined`, () => {
    const input = { provide: Provide, defaultValue: token, deps: [Provide] };
    const output = { provide: Provide, useExisting: token, deps: [Provide] };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with multi if defined`, () => {
    const input = { provide: Provide, defaultValue: token, multi: true };
    const output = { provide: Provide, useExisting: token, multi: true };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useExisting if value is InjectionToken`, () => {
    const input = { provide: Provide, defaultValue: token };
    const output = { provide: Provide, useExisting: token };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useClass if value is Class`, () => {
    const input = { provide: Provide, defaultValue: Provide };
    const output = { provide: Provide, useClass: Provide };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useFactory if value is named function`, () => {
    const input = { provide: Provide, defaultValue: namedFn };
    const output = { provide: Provide, useFactory: namedFn };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useFactory if value is anonymous function`, () => {
    const input = { provide: Provide, defaultValue: fn };
    const output = { provide: Provide, useFactory: fn };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useValue if value is object instance`, () => {
    const input = { provide: Provide, defaultValue: new Provide() };
    const output = { provide: Provide, useValue: new Provide() };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useValue if value is plain object`, () => {
    const input = { provide: Provide, defaultValue: { a: 0 } };
    const output = { provide: Provide, useValue: { a: 0 } };
    expect(configProviderFactory(input)).toEqual(output);
  });

  it(`returns Provider with useValue if value is other type`, () => {
    let input: any = { provide: Provide, defaultValue: 'a' };
    let output: any = { provide: Provide, useValue: 'a' };
    expect(configProviderFactory(input)).toEqual(output);

    input.defaultValue = 1;
    output.useValue = 1;
    expect(configProviderFactory(input)).toEqual(output);

    input.defaultValue = true;
    output.useValue = true;
    expect(configProviderFactory(input)).toEqual(output);

    input.defaultValue = ['a'];
    output.useValue = ['a'];
    expect(configProviderFactory(input)).toEqual(output);
  });
});
