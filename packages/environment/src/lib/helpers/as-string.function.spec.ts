import { asString } from './as-string.function';

describe('asString(value)', () => {
  it(`returns string from string`, () => {
    expect(asString('a')).toEqual('a');
  });

  it(`returns string from number`, () => {
    expect(asString(0)).toEqual('0');
  });

  it(`returns string from boolean`, () => {
    expect(asString(true)).toEqual('true');
  });

  it(`returns string from null`, () => {
    expect(asString(null)).toEqual('null');
  });

  it(`returns string from Array`, () => {
    expect(asString([0, 'a', null, true])).toEqual('[0,"a",null,true]');
  });

  it(`returns string from Object`, () => {
    expect(asString({ a: 0 })).toEqual('{"a":0}');
  });

  it(`returns string from Object with method`, () => {
    expect(asString({ a: () => ({ a: 0 }) })).toEqual('{"a":"() => ({ a: 0 })"}');
  });

  it(`returns string from Array of Objects`, () => {
    expect(asString([{ a: 0 }])).toEqual('[{"a":0}]');
  });

  it(`returns string from Object with Arrays`, () => {
    expect(asString({ a: [0, 'a', null, true] })).toEqual('{"a":[0,"a",null,true]}');
  });

  it(`returns string if TypeError converting an Object`, () => {
    const a: any = { a: '0' };
    a.myself = a;
    expect(asString(a)).toEqual('[object Object]');
  });
});
