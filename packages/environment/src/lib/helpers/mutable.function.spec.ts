import { isEqual } from 'lodash-es';

import { mutable } from './mutable.function';

const obj = Object.freeze({ a: Object.freeze({ b: 0 }), b: '{{ a.b }}' });
const arr: ReadonlyArray<any> = Object.freeze([Object.freeze({ a: 0 }), Object.freeze({ b: 0 })]);

describe('mutable(value)', () => {
  it(`returns non object values as is`, () => {
    expect(mutable('a')).toEqual('a');
    expect(mutable(0)).toEqual(0);
    expect(mutable(true)).toBeTrue();
    expect(mutable(null)).toEqual(null);
  });

  it(`returns the property as mutable if is an object`, () => {
    const value = mutable(obj);
    expect(isEqual(value, obj)).toBeTrue();
    expect(obj).toBeFrozen();
    expect(obj.a).toBeFrozen();
    expect(value).not.toBeFrozen();
    expect(value.a).not.toBeFrozen();
  });

  it(`returns the property as mutable if is an Array`, () => {
    const value = mutable(arr);
    expect(isEqual(value, arr)).toBeTrue();
    expect(arr).toBeFrozen();
    expect(arr[0]).toBeFrozen();
    expect(value).not.toBeFrozen();
    expect(value[0]).not.toBeFrozen();
  });
});
