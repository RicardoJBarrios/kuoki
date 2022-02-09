import { install, InstalledClock } from '@sinonjs/fake-timers';
import { BehaviorSubject, delay, of, throwError } from 'rxjs';
import { validate } from 'uuid';

import {
  OnAfterComplete,
  OnAfterError,
  OnAfterLoad,
  OnAfterSourceAdd,
  OnAfterSourceComplete,
  OnAfterSourceError,
  OnBeforeLoad,
  OnBeforeSourceAdd,
  OnBeforeSourceLoad
} from '.';
import { EnvironmentService } from '../service';
import { EnvironmentState, EnvironmentStore } from '../store';
import { EnvironmentLoader } from './environment-loader.application';
import { LoaderSource } from './loader-source.type';

class TestEnvironmentStore extends EnvironmentStore {
  private _state = new BehaviorSubject({});
  getAll$() {
    return this._state.asObservable();
  }
  getAll() {
    return this._state.getValue();
  }
  update(environment: any) {
    this._state.next(environment);
  }
  reset() {
    this._state.next({});
  }
}

class Loader
  extends EnvironmentLoader
  implements
    OnAfterLoad,
    OnAfterComplete,
    OnAfterError,
    OnAfterSourceAdd,
    OnAfterSourceComplete,
    OnAfterSourceError,
    OnBeforeLoad,
    OnBeforeSourceAdd,
    OnBeforeSourceLoad
{
  constructor(protected override service: EnvironmentService, protected override sources?: any) {
    super(service, sources);
  }
  onAfterLoad(): void {
    console.log('onAfterLoad');
  }
  onAfterComplete(): void {
    console.log('onAfterComplete');
  }
  onAfterError<E extends Error>(error: E): void {
    console.log('onAfterError', error);
  }
  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    console.log('onAfterSourceAdd', properties, source);
  }
  onAfterSourceComplete(source: LoaderSource): void {
    console.log('onAfterSourceComplete', source);
  }
  onAfterSourceError(error: Error, source: LoaderSource): void {
    console.log('onAfterSourceError', error, source);
  }
  onBeforeLoad(): void {
    console.log('onBeforeLoad');
  }
  onBeforeSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    console.log('onBeforeSourceAdd', properties, source);
  }
  onBeforeSourceLoad(source: LoaderSource): void {
    console.log('onBeforeSourceLoad', source);
  }
}

describe('EnvironmentLoader', () => {
  let store: EnvironmentStore;
  let service: EnvironmentService;
  let loader: Loader;
  let clock: InstalledClock;
  let load: jest.Mock<any, any>;

  beforeEach(() => {
    store = new TestEnvironmentStore();
    service = new EnvironmentService(store);
    loader = new Loader(service);
    clock = install();
    load = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(() => null);
  });

  afterEach(() => {
    clock.uninstall();
    load.mockRestore();
    jest.restoreAllMocks();
  });

  it(`.loaderSources is set on constructor with single source`, () => {
    const source1 = { id: 'a', load: () => [{ a: 0 }] };
    loader = new Loader(service, source1);

    expect(loader['loaderSources']).toBeArrayOfSize(1);
    expect(loader['loaderSources'][0]).toEqual(source1);
  });

  it(`.loaderSources is set on constructor with sources array`, () => {
    const source1 = { id: 'a', load: () => [{ a: 0 }] };
    const source2 = { id: 'b', load: () => [{ b: 0 }] };
    loader = new Loader(service, [source1, source2]);

    expect(loader['loaderSources']).toBeArrayOfSize(2);
    expect(loader['loaderSources'][0]).toEqual(source1);
    expect(loader['loaderSources'][1]).toEqual(source2);
  });

  it(`.loaderSources sets source id with UUID if undefined`, () => {
    const source1 = { load: () => [{ a: 0 }] };
    loader = new Loader(service, source1);

    expect(loader['loaderSources']).toBeArrayOfSize(1);
    expect(validate(loader['loaderSources'][0].id)).toBeTrue();
  });

  it(`.sourcesSubject$ is set on constructor`, () => {
    const source1 = { id: 'a', load: () => [{ a: 0 }] };
    const source2 = { id: 'b', load: () => [{ b: 0 }] };
    loader = new Loader(service, [source1, source2]);

    expect(loader['sourcesSubject$'].size).toEqual(2);
    expect([...loader['sourcesSubject$'].keys()]).toEqual([source1.id, source2.id]);
  });

  it(`.load() resolves immedialely if there is no required sources`, async () => {
    const source1 = { load: () => of({ a: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).toHaveBeenCalledTimes(1);
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(10); // 10
    expect(store.getAll()).toEqual({ a: 0 });
  });

  it(`.load() rejects with Error`, async () => {
    const source1 = { id: 'a', isRequired: true, load: () => throwError(() => new Error('test')) };
    const error = new Error('The environment source "a" failed to load: test');
    loader = new Loader(service, [source1]);

    await expect(loader.load()).rejects.toEqual(error);
  });

  it(`.load() rejects without Error`, async () => {
    const source1 = { id: 'a', isRequired: true, load: () => throwError(() => 'test') };
    const error = new Error('The environment source "a" failed to load: test');
    loader = new Loader(service, [source1]);

    await expect(loader.load()).rejects.toEqual(error);
  });

  // it(`.load() resolves if called multiple times`, async () => {
  //   const source1 = { isRequired: true, load: () => of({ a: 0 }).pipe(delay(10)) };
  //   loader = new Loader(service, [source1]);
  //   loader.load().then(() => load());

  //   await clock.tickAsync(0); // 0
  //   expect(load).not.toHaveBeenCalled();
  //   expect(store.getAll()).toEqual({});

  //   await clock.tickAsync(5); // 5
  //   loader.load().then(() => load());

  //   await clock.tickAsync(0); // 5
  //   expect(load).not.toHaveBeenCalled();
  //   expect(store.getAll()).toEqual({});

  //   await clock.tickAsync(5); // 10
  //   expect(load).not.toHaveBeenCalled();
  //   expect(store.getAll()).toEqual({ a: 0 });

  //   // await clock.tickAsync(10); // 10
  //   // expect(store.getAll()).toEqual({ a: 0 });
  // });

  it(`.resolveLoad() forces the load to resolve`, async () => {
    const source1 = { isRequired: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 5
    expect(load).not.toHaveBeenCalled();
    loader.resolveLoad();

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 10
    expect(store.getAll()).toEqual({ a: 0 });
  });

  it(`.rejectLoad() forces the load to reject`, async () => {
    const source1 = { isRequired: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().catch(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 5
    expect(load).not.toHaveBeenCalled();
    loader.rejectLoad(new Error());

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 10
    expect(store.getAll()).toEqual({ a: 0 });
  });

  it(`.completeAllSources() completes all ongoing sources`, async () => {
    const source1 = { isRequired: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 5
    expect(load).not.toHaveBeenCalled();
    loader.completeAllSources();

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 10
    expect(store.getAll()).toEqual({});
  });

  it(`.completeSource(source) completes the source`, async () => {
    const source1 = { isRequired: true, isOrdered: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    const source2 = { isRequired: true, isOrdered: true, load: () => of({ b: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1, source2]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 5
    loader.completeSource(loader['loaderSources'][0]);

    await clock.tickAsync(5); // 10
    expect(load).not.toHaveBeenCalled();
    expect(store.getAll()).toEqual({});

    await clock.tickAsync(5); // 15
    expect(load).toHaveBeenCalledTimes(1);
    expect(store.getAll()).toEqual({ b: 0 });
  });

  it(`.onDestroy() sttops all the streams`, async () => {
    const source1 = { id: 'a', isRequired: true, isOrdered: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    const source2 = { id: 'b', isRequired: true, isOrdered: true, load: () => of({ b: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1, source2]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(store.getAll()).toEqual({});
    expect(loader['loadSubject$'].isStopped).toBeFalse();
    expect(loader['isRequiredSubject$'].isStopped).toBeFalse();
    expect(loader['sourcesSubject$'].get('a')?.isStopped).toBeFalse();
    expect(loader['sourcesSubject$'].get('b')?.isStopped).toBeFalse();

    await clock.tickAsync(5); // 5
    loader.onDestroy();

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(store.getAll()).toEqual({});
    expect(loader['loadSubject$'].isStopped).toBeTrue();
    expect(loader['isRequiredSubject$'].isStopped).toBeTrue();
    expect(loader['sourcesSubject$'].get('a')?.isStopped).toBeTrue();
    expect(loader['sourcesSubject$'].get('b')?.isStopped).toBeTrue();

    await clock.runAllAsync();
    expect(store.getAll()).toEqual({});
  });

  it(`.preAddProperties(properties, source) intercepts every value before store`, async () => {
    const source1 = { id: 'a', load: () => of({ a: 0 }) };
    loader = new Loader(service, [source1]);
    loader.preAddProperties = (p: any, s: any) => ({ ...p, ...s });
    loader.load();

    await clock.tickAsync(0); // 0
    expect(store.getAll()).toEqual({ a: 0, ...source1 });
  });

  describe('Lifecycle Hooks', () => {
    it(`executes hooks in order if resolves`, async () => {
      const properties = { a: 0 };
      const afterProperties = { b: 0 };
      const source1 = { load: () => of(properties) };
      loader = new Loader(service, [source1]);
      loader.preAddProperties = () => afterProperties;
      const source = loader['loaderSources'][0];

      await expect(loader.load()).toResolve();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad', source);
      expect(console.log).toHaveBeenNthCalledWith(3, 'onBeforeSourceAdd', properties, source);
      expect(console.log).toHaveBeenNthCalledWith(4, 'onAfterSourceAdd', afterProperties, source);
      expect(console.log).toHaveBeenNthCalledWith(5, 'onAfterSourceComplete', source);
      expect(console.log).toHaveBeenNthCalledWith(6, 'onAfterComplete');
      expect(console.log).toHaveBeenNthCalledWith(7, 'onAfterLoad');
    });

    it(`executes hooks in order if rejects`, async () => {
      const error = new Error('test');
      const finalError = new Error('The environment source "a" failed to load: test');
      const source1 = { id: 'a', isRequired: true, load: () => throwError(() => error) };
      loader = new Loader(service, [source1]);
      const source = loader['loaderSources'][0];

      await expect(loader.load()).toReject();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad', source);
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterSourceError', error, source);
      expect(console.log).toHaveBeenNthCalledWith(4, 'onAfterSourceComplete', source);
      expect(console.log).toHaveBeenNthCalledWith(5, 'onAfterComplete');
      expect(console.log).toHaveBeenNthCalledWith(6, 'onAfterError', finalError);
    });
  });
});
