import { ifDefined } from './if-defined.function';

describe('ifDefined(value,check)', () => {
  it(`returns true if value is null`, () => {
    expect(ifDefined(null, false)).toBeTrue();
    expect(ifDefined(null, true)).toBeTrue();
  });

  it(`returns true if value is undefined`, () => {
    expect(ifDefined(undefined, false)).toBeTrue();
    expect(ifDefined(undefined, true)).toBeTrue();
  });

  it(`returns check if value is defined`, () => {
    expect(ifDefined(0, false)).toBeFalse();
    expect(ifDefined(0, true)).toBeTrue();
  });
});
