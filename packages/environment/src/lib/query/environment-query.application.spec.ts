import { Observable, of, Subject } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { delay } from 'rxjs/operators';

import { EnvironmentState, EnvironmentStore } from '../store';
import { EnvironmentQuery } from './environment-query.application';

export class TestEnvironmentStore extends EnvironmentStore {
  getAll$(): Observable<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
  getAll(): EnvironmentState {
    throw new Error('Method not implemented.');
  }
  update(environment: EnvironmentState): void {}
  reset(): void {}
}

const envA1 = Object.freeze({ a: Object.freeze({ a: 0 }), b: '{{a.a}}' });
const envA2 = { a: { a: 0 }, b: '{{a.a}}' };
const envB1 = Object.freeze({ a: Object.freeze({ c: 0 }), b: '{{a.b}}' });
const envB2 = { a: { c: 0 }, b: '{{a.b}}' };

describe('EnvironmentQuery', () => {
  let store: EnvironmentStore;
  let query: EnvironmentQuery;

  beforeEach(() => {
    store = new TestEnvironmentStore();
    query = new EnvironmentQuery(store);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // getAll$

  it(
    `getAll$() returns all the distinct environment properties as Observable`,
    marbles((m) => {
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-a---b---a-|', { a: envA1, b: envB1 });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.getAll$()).toBeObservable(expected);
    })
  );

  it(`getAll$() returns always the last value`, () => {
    const sub = new Subject<EnvironmentState>();
    const value = { a: 0 };
    jest.spyOn(console, 'log').mockImplementation(() => null);
    jest.spyOn(store, 'getAll$').mockReturnValue(sub);
    const prop = query.getAll$();
    prop.subscribe({ next: (v) => console.log(v) });
    sub.next(value);
    expect(console.log).toHaveBeenNthCalledWith(1, value);
    prop.subscribe({ next: (v) => console.log(v) });
    expect(console.log).toHaveBeenNthCalledWith(2, value);
  });

  // getAllAsync

  it(`getAllAsync() returns the first non empty set of environment properties as Promise`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, undefined, {}, envA1, envA2).pipe(delay<any>(5)));
    await expect(query.getAllAsync()).resolves.toEqual(envA1);
  });

  // getAll

  it(`getAll(path) returns all the environment properties`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    expect(query.getAll()).toEqual(envA1);
  });

  // containsAll$

  it(
    `containsAll$(...paths) returns if all the distinct environment property paths are available for resolution as Observable`,
    marbles((m) => {
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-t---f---t-|', { t: true, f: false });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.containsAll$('b', 'a.a')).toBeObservable(expected);
    })
  );

  it(`containsAll$(...paths) returns always the last value`, () => {
    const sub = new Subject<EnvironmentState>();
    const value = { a: 0 };
    jest.spyOn(console, 'log').mockImplementation(() => null);
    jest.spyOn(store, 'getAll$').mockReturnValue(sub);
    const prop = query.containsAll$('a');
    prop.subscribe({ next: (v) => console.log(v) });
    sub.next(value);
    expect(console.log).toHaveBeenNthCalledWith(1, true);
    prop.subscribe({ next: (v) => console.log(v) });
    expect(console.log).toHaveBeenNthCalledWith(2, true);
  });

  // containsAllAsync

  it(`containsAllAsync(...paths) returns true as Promise when all environment property paths exists`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envB1).pipe(delay<any>(5)));
    await expect(query.containsAllAsync('a.c', 'b')).resolves.toBeTrue();
  });

  // containsAll

  it(`containsAll(...paths) returns true if all the environment property paths exists`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envB1);
    expect(query.containsAll('a.c', 'b')).toBeTrue();
    expect(query.containsAll(['a', 'c'], 'b')).toBeTrue();
  });

  it(`containsAll(...paths) returns false if an environment property path doesn't exist`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    expect(query.containsAll('a.a', 'z')).toBeFalse();
  });

  // containsSome$

  it(
    `containsSome$(...paths) returns if some distinct environment property paths are available for resolution as Observable`,
    marbles((m) => {
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-t---f---t-|', { t: true, f: false });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.containsSome$('a.a', 'z')).toBeObservable(expected);
    })
  );

  it(`containsSome$(...paths) returns always the last value`, () => {
    const sub = new Subject<EnvironmentState>();
    const value = { a: 0 };
    jest.spyOn(console, 'log').mockImplementation(() => null);
    jest.spyOn(store, 'getAll$').mockReturnValue(sub);
    const prop = query.containsSome$('a');
    prop.subscribe({ next: (v) => console.log(v) });
    sub.next(value);
    expect(console.log).toHaveBeenNthCalledWith(1, true);
    prop.subscribe({ next: (v) => console.log(v) });
    expect(console.log).toHaveBeenNthCalledWith(2, true);
  });

  // containsSomeAsync

  it(`containsSomeAsync(...paths) returns true as Promise when some environment property paths exists`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envA1).pipe(delay<any>(5)));
    await expect(query.containsSomeAsync('a.a', 'z')).resolves.toBeTrue();
  });

  // containsSome

  it(`containsSome(...paths) returns true if some environment property paths exists`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    expect(query.containsSome('a.a', 'z')).toBeTrue();
  });

  it(`containsSome(...paths) returns false if all the environment property paths doesn't exist`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    expect(query.containsSome('a.z', 'z')).toBeFalse();
  });

  // get$

  it(
    `get$(path) returns the distinct environment property at path as Observable`,
    marbles((m) => {
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-a---b---a-|', { a: 0, b: undefined });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.get$('a.a')).toBeObservable(expected);
    })
  );

  it(`get$(path) returns always the last value`, () => {
    const sub = new Subject<EnvironmentState>();
    const value = { a: 0 };
    jest.spyOn(console, 'log').mockImplementation(() => null);
    jest.spyOn(store, 'getAll$').mockReturnValue(sub);
    const prop = query.get$('a');
    prop.subscribe({ next: (v) => console.log(v) });
    sub.next(value);
    expect(console.log).toHaveBeenNthCalledWith(1, value.a);
    prop.subscribe({ next: (v) => console.log(v) });
    expect(console.log).toHaveBeenNthCalledWith(2, value.a);
  });

  it(
    `get$(path,{defaultValue}) returns the default value if the path cannot be resolved`,
    marbles((m) => {
      const defaultValue = 1;
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-a---b---a-|', { a: 0, b: 1 });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.get$('a.a', { defaultValue })).toBeObservable(expected);
    })
  );

  it(
    `get$(path,{targetType}) returns the typed environment property at path`,
    marbles((m) => {
      const targetType = String;
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-a---b---a-|', { a: '0', b: undefined });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.get$('a.a', { targetType })).toBeObservable(expected);
    })
  );

  it(
    `get$(path,{transpile}) returns the transpiled environment property at path`,
    marbles((m) => {
      const transpile = { a: { a: 0 } };
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-a---b---a-|', { a: '0', b: '{{a.b}}' });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.get$('b', { transpile })).toBeObservable(expected);
    })
  );

  it(
    `get$(path,{defaultValue,targetType,transpile}) returns the modified environment property at path`,
    marbles((m) => {
      const defaultValue = 1;
      const targetType = (value: any) => (value === 1 ? '{{t}}' : value);
      const transpile = { t: 2 };
      const source = m.cold('-a-b-c-d-a-|', { a: envA1, b: envA2, c: envB1, d: envB2 });
      const expected = m.cold('-a---b---a-|', { a: 0, b: '2' });
      jest.spyOn(store, 'getAll$').mockReturnValue(source);
      m.expect(query.get$('a.a', { defaultValue, targetType, transpile })).toBeObservable(expected);
    })
  );

  // getAsync

  it(`getAsync(path) returns the non nil environment property at path`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envA1) as Observable<EnvironmentState>);
    await expect(query.getAsync('a.a')).resolves.toEqual(0);
  });

  it(`getAsync(path,{defaultValue}) returns the default value if the path cannot be resolved`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envA1) as Observable<EnvironmentState>);
    const defaultValue = 1;
    await expect(query.getAsync('a.a', { defaultValue })).resolves.toEqual(1);
  });

  it(`getAsync(path,{targetType}) returns the typed environment property at path`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envA1) as Observable<EnvironmentState>);
    const targetType = String;
    await expect(query.getAsync('a.a', { targetType })).resolves.toEqual('0');
  });

  it(`getAsync(path,{transpile}) returns the transpiled environment property at path`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envA1) as Observable<EnvironmentState>);
    const transpile = { a: { a: 2 } };
    await expect(query.getAsync('b', { transpile })).resolves.toEqual('2');
  });

  it(`getAsync(path,{defaultValue,targetType,transpile}) returns the modified environment property at path`, async () => {
    jest.spyOn(store, 'getAll$').mockReturnValue(of(null, {}, { a: 0 }, envA1) as Observable<EnvironmentState>);
    const defaultValue = 1;
    const targetType = (value: any) => (value === 1 ? '{{t}}' : value);
    const transpile = { t: 2 };
    await expect(query.getAsync('a.a', { defaultValue, targetType, transpile })).resolves.toEqual('2');
  });

  // get

  it(`get(path) returns the environment property at path.`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    expect(query.get('a.a')).toEqual(0);
  });

  it(`get(path) returns undefined if the path cannot be resolved`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    expect(query.get('a.z')).toBeUndefined();
  });

  it(`get(path,{defaultValue}) returns the default value if the path cannot be resolved`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    const defaultValue = 1;
    expect(query.get('a.z', { defaultValue })).toEqual(1);
  });

  it(`get(path,{targetType}) returns the typed environment property at path`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    const targetType = String;
    expect(query.get('a.a', { targetType })).toEqual('0');
  });

  it(`get(path,{transpile}) returns the transpiled environment property at path`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    const transpile = { a: { a: 2 } };
    expect(query.get('b', { transpile })).toEqual('2');
  });

  it(`get(path,{defaultValue,targetType,transpile}) returns the modified environment property at path`, () => {
    jest.spyOn(store, 'getAll').mockReturnValue(envA1);
    const defaultValue = 1;
    const targetType = (value: any) => (value === 1 ? '{{t}}' : value);
    const transpile = { t: 2 };
    expect(query.get('a.z', { defaultValue, targetType, transpile })).toEqual('2');
  });

  describe('transpile options', () => {
    it(`{transpile} returns transpiled with any type of space in the interpolation`, () => {
      const env = { b: '{{  a.a}}' };
      jest.spyOn(store, 'getAll').mockReturnValue(env);
      const transpile = { a: { a: 0 } };
      expect(query.get('b', { transpile })).toEqual('0');
    });

    it(`{transpile} returns transpiled object as string`, () => {
      const env = { b: '{{a.a}}' };
      jest.spyOn(store, 'getAll').mockReturnValue(env);
      const transpile = { a: { a: { a: 1 } } };
      expect(query.get('b', { transpile })).toEqual('{"a":1}');
    });

    it(`{transpile} returns transpiled invalid object`, () => {
      const env = { b: '{{a.a}}' };
      jest.spyOn(store, 'getAll').mockReturnValue(env);
      jest.spyOn(JSON, 'stringify').mockImplementation(() => {
        throw new Error();
      });
      const transpile = { a: { a: { a: 1 } } };
      expect(query.get('b', { transpile })).toEqual('[object Object]');
    });

    it(`{transpile} returns transpiled with config.transpileEnvironment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(envA1);
      const transpile = {};
      (query as any).config.transpileEnvironment = true;
      expect(query.get('b', { transpile })).toEqual('0');
    });

    it(`{transpile,transpileEnvironment} returns transpiled with transpileEnvironment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(envA1);
      const transpile = {};
      const transpileEnvironment = true;
      expect(query.get('b', { transpile })).toEqual('{{a.a}}');
      expect(query.get('b', { transpile, transpileEnvironment })).toEqual('0');
    });

    it(`{transpile} returns transpiled with config.interpolation`, () => {
      const env = { b: '[< a.a >]' };
      jest.spyOn(store, 'getAll').mockReturnValue(env);
      const transpile = { a: { a: 0 } };
      (query as any).config.interpolation = ['[<', '>]'];
      expect(query.get('b', { transpile })).toEqual('0');
    });

    it(`{transpile,interpolation} returns transpiled with interpolation`, () => {
      const env = { b: '[< a.a >]' };
      jest.spyOn(store, 'getAll').mockReturnValue(env);
      const transpile = { a: { a: 0 } };
      const interpolation: [string, string] = ['[<', '>]'];
      expect(query.get('b', { transpile })).toEqual('[< a.a >]');
      expect(query.get('b', { transpile, interpolation })).toEqual('0');
    });

    it(`{transpile,interpolation,transpileEnvironment} returns transpiled with interpolation and transpileEnvironment`, () => {
      const env = { a: { a: 0 }, b: '[< a.a >]' };
      jest.spyOn(store, 'getAll').mockReturnValue(env);
      const transpile = {};
      const interpolation: [string, string] = ['[<', '>]'];
      const transpileEnvironment = true;
      expect(query.get('b', { transpile })).toEqual('[< a.a >]');
      expect(query.get('b', { transpile, interpolation, transpileEnvironment })).toEqual('0');
    });
  });
});
