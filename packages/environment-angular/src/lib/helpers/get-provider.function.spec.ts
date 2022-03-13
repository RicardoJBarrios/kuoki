import { InjectionToken } from '@angular/core';

import { getProvider } from './get-provider.function';

class Provide {}
const token = new InjectionToken<Provide>('TOKEN');
function namedFn() {}
const fn = () => new Provide();

describe('getProvider(provide,configValue,defaultValue,deps?)', () => {
  it(`returns Provider with configValue if defined`, () => {
    expect(getProvider(Provide, token, Provide)).toEqual({ provide: Provide, useExisting: token });
  });

  it(`returns Provider with defaultValue if configValue undefined`, () => {
    expect(getProvider(Provide, undefined, token)).toEqual({ provide: Provide, useExisting: token });
  });

  it(`returns Provider with defaultValue if configValue null`, () => {
    expect(getProvider(Provide, null, token)).toEqual({ provide: Provide, useExisting: token });
  });

  it(`returns Provider with deps if defined`, () => {
    expect(getProvider(Provide, undefined, token, [Provide])).toEqual({
      provide: Provide,
      useExisting: token,
      deps: [Provide]
    });
  });

  it(`returns Provider with useExisting if value is InjectionToken`, () => {
    expect(getProvider(Provide, undefined, token)).toEqual({ provide: Provide, useExisting: token });
  });

  it(`returns Provider with useClass if value is a Class`, () => {
    expect(getProvider(Provide, undefined, Provide)).toEqual({ provide: Provide, useClass: Provide });
  });

  it(`returns Provider with useFactory if value is a named function`, () => {
    expect(getProvider(Provide, undefined, namedFn)).toEqual({ provide: Provide, useFactory: namedFn });
  });

  it(`returns Provider with useFactory if value is a factory function`, () => {
    expect(getProvider(Provide, undefined, fn)).toEqual({ provide: Provide, useFactory: fn });
  });

  it(`returns Provider with useValue in any other option`, () => {
    expect(getProvider(Provide, undefined, { a: 0 })).toEqual({ provide: Provide, useValue: { a: 0 } });
  });
});
