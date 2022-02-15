import { install, InstalledClock } from '@sinonjs/fake-timers';
import { createMockInstance } from 'jest-create-mock-instance';
import { delay, of, throwError } from 'rxjs';
import { ArrayOrSingle } from 'ts-essentials';
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
} from '../lifecycle-hooks';
import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { EnvironmentState } from '../store';
import { EnvironmentLoader } from './environment-loader.application';
import { LoaderSource } from './loader-source.type';

const hook = jest.fn();

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
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<EnvironmentSource>
  ) {
    super(service, sources);
  }
  onAfterLoad(): void {
    hook('onAfterLoad');
  }
  onAfterComplete(): void {
    hook('onAfterComplete');
  }
  onAfterError<E extends Error>(error: E): void {
    hook('onAfterError', error);
  }
  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    hook('onAfterSourceAdd', properties, source);
  }
  onAfterSourceComplete(source: LoaderSource): void {
    hook('onAfterSourceComplete', source);
  }
  onAfterSourceError(error: Error, source: LoaderSource): void {
    hook('onAfterSourceError', error, source);
  }
  onBeforeLoad(): void {
    hook('onBeforeLoad');
  }
  onBeforeSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    hook('onBeforeSourceAdd', properties, source);
  }
  onBeforeSourceLoad(source: LoaderSource): void {
    hook('onBeforeSourceLoad', source);
  }
}

describe('EnvironmentLoader', () => {
  let service: jest.Mocked<EnvironmentService>;
  let loader: EnvironmentLoader;
  let clock: InstalledClock;
  let load: jest.Mock<any, any>;

  beforeEach(() => {
    service = createMockInstance(EnvironmentService);
    loader = new Loader(service);
    clock = install();
    load = jest.fn();
  });

  afterEach(() => {
    clock.uninstall();
    load.mockRestore();
    hook.mockRestore();
    jest.restoreAllMocks();
  });

  it(`throws if there are sources with duplicated ids`, () => {
    const source1: EnvironmentSource = { id: 'a', load: () => [{ a: 0 }] };
    const source2: EnvironmentSource = { id: 'a', load: () => [{ b: 0 }] };
    const source3: EnvironmentSource = { id: 'b', load: () => [{ a: 0 }] };
    const source4: EnvironmentSource = { id: 'b', load: () => [{ b: 0 }] };
    const error: Error = new Error(`There are sources with duplicate id's: a, b`);

    expect(() => new Loader(service, [source1, source2, source3, source4])).toThrowError(error);
  });

  it(`.loaderSources is set on constructor with single source`, () => {
    const source1: EnvironmentSource = { id: 'a', load: () => [{ a: 0 }] };
    loader = new Loader(service, source1);

    expect(loader['loaderSources']).toBeArrayOfSize(1);
    expect(loader['loaderSources'][0]).toEqual(source1);
  });

  it(`.loaderSources is set on constructor with sources array`, () => {
    const source1: EnvironmentSource = { id: 'a', load: () => [{ a: 0 }] };
    const source2: EnvironmentSource = { id: 'b', load: () => [{ b: 0 }] };
    loader = new Loader(service, [source1, source2]);

    expect(loader['loaderSources']).toBeArrayOfSize(2);
    expect(loader['loaderSources'][0]).toEqual(source1);
    expect(loader['loaderSources'][1]).toEqual(source2);
  });

  it(`.loaderSources sets source id with UUID if undefined`, () => {
    const source1: EnvironmentSource = { load: () => [{ a: 0 }] };
    loader = new Loader(service, source1);

    expect(loader['loaderSources']).toBeArrayOfSize(1);
    expect(validate(loader['loaderSources'][0].id)).toBeTrue();
  });

  it(`.sourcesSubject$ is set on constructor`, () => {
    const source1: EnvironmentSource = { id: 'a', load: () => [{ a: 0 }] };
    const source2: EnvironmentSource = { id: 'b', load: () => [{ b: 0 }] };
    loader = new Loader(service, [source1, source2]);

    expect(loader['sourcesSubject$'].size).toEqual(2);
    expect([...loader['sourcesSubject$'].keys()]).toEqual([source1.id, source2.id]);
  });

  it(`.load() resolves immedialely if there are no required sources`, async () => {
    const state1: EnvironmentState = { a: 0 };
    const source1: EnvironmentSource = { load: () => of(state1).pipe(delay(5)) };
    loader = new Loader(service, [source1]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).toHaveBeenCalledTimes(1);
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 5
    expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);

    await clock.runAllAsync();
    expect(service.add).toHaveBeenCalledTimes(1);
  });

  it(`.load() rejects with Error`, async () => {
    const source1: EnvironmentSource = { id: 'a', isRequired: true, load: () => throwError(() => new Error('test')) };
    const error: Error = new Error('The environment source "a" failed to load: test');
    loader = new Loader(service, [source1]);

    await expect(loader.load()).rejects.toEqual(error);
  });

  it(`.resolveLoad() forces the load to resolve`, async () => {
    const state1: EnvironmentState = { a: 0 };
    const source1: EnvironmentSource = { isRequired: true, load: () => of(state1).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 5
    expect(load).not.toHaveBeenCalled();
    loader.resolveLoad();

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 10
    expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);

    await clock.runAllAsync();
    expect(service.add).toHaveBeenCalledTimes(1);
  });

  it(`.rejectLoad() forces the load to reject`, async () => {
    const state1: EnvironmentState = { a: 0 };
    const source1: EnvironmentSource = { isRequired: true, load: () => of(state1).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().catch(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 5
    expect(load).not.toHaveBeenCalled();
    loader.rejectLoad(new Error());

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 10
    expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);

    await clock.runAllAsync();
    expect(service.add).toHaveBeenCalledTimes(1);
  });

  it(`.completeAllSources() completes all ongoing sources`, async () => {
    const source1: EnvironmentSource = { isRequired: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 5
    expect(load).not.toHaveBeenCalled();
    loader.completeAllSources();

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 10
    expect(service.add).not.toHaveBeenCalled();
  });

  it(`.completeSource(source) completes the source`, async () => {
    const state2: EnvironmentState = { b: 0 };
    const source1: EnvironmentSource = { isRequired: true, isOrdered: true, load: () => of({ a: 0 }).pipe(delay(10)) };
    const source2: EnvironmentSource = { isRequired: true, isOrdered: true, load: () => of(state2).pipe(delay(10)) };
    loader = new Loader(service, [source1, source2]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 5
    loader.completeSource(loader['loaderSources'][0]);

    await clock.tickAsync(5); // 10
    expect(load).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 15
    expect(load).toHaveBeenCalledTimes(1);
    expect(service.add).toHaveBeenNthCalledWith(1, state2, undefined);

    await clock.runAllAsync();
    expect(service.add).toHaveBeenCalledTimes(1);
  });

  it(`.onDestroy() is called after all sources completes`, async () => {
    const source1: EnvironmentSource = { isRequired: true, load: () => throwError(() => new Error()) };
    const source2: EnvironmentSource = { load: () => of({ a: 0 }).pipe(delay(10)) };
    loader = new Loader(service, [source1, source2]);
    jest.spyOn(loader, 'onDestroy');
    loader.load().catch(() => load());

    await clock.tickAsync(0); // 0
    expect(loader.onDestroy).not.toHaveBeenCalled();
    expect(load).toHaveBeenCalled();

    await clock.tickAsync(5); // 5
    expect(loader.onDestroy).not.toHaveBeenCalled();

    await clock.tickAsync(5); // 10
    expect(loader.onDestroy).toHaveBeenCalledTimes(1);
  });

  it(`.onDestroy() stops all the streams`, async () => {
    const source1: EnvironmentSource = {
      id: 'a',
      isRequired: true,
      isOrdered: true,
      load: () => of({ a: 0 }).pipe(delay(10))
    };
    const source2: EnvironmentSource = {
      id: 'b',
      isRequired: true,
      isOrdered: true,
      load: () => of({ b: 0 }).pipe(delay(10))
    };
    loader = new Loader(service, [source1, source2]);
    loader.load().then(() => load());

    await clock.tickAsync(0); // 0
    expect(load).not.toHaveBeenCalled();
    expect(service.add).not.toHaveBeenCalled();
    expect(loader['loadSubject$'].isStopped).toBeFalse();
    expect(loader['isRequiredSubject$'].isStopped).toBeFalse();
    expect(loader['sourcesSubject$'].get('a')?.isStopped).toBeFalse();
    expect(loader['sourcesSubject$'].get('b')?.isStopped).toBeFalse();

    await clock.tickAsync(5); // 5
    loader.onDestroy();

    await clock.tickAsync(0); // 5
    expect(load).toHaveBeenCalledTimes(1);
    expect(service.add).not.toHaveBeenCalled();
    expect(loader['loadSubject$'].isStopped).toBeTrue();
    expect(loader['isRequiredSubject$'].isStopped).toBeTrue();
    expect(loader['sourcesSubject$'].get('a')?.isStopped).toBeTrue();
    expect(loader['sourcesSubject$'].get('b')?.isStopped).toBeTrue();

    await clock.runAllAsync();
    expect(service.add).not.toHaveBeenCalled();
  });

  it(`.preAddProperties(properties, source) intercepts every value before store`, async () => {
    const state1: EnvironmentState = { a: 0 };
    const source1: EnvironmentSource = { id: 'a', load: () => of(state1) };
    loader = new Loader(service, [source1]);
    loader.preAddProperties = (p: any, s: any) => ({ ...p, ...s });
    loader.load();

    await clock.tickAsync(0); // 0
    expect(service.add).toHaveBeenNthCalledWith(1, { ...state1, ...source1 }, undefined);
    expect(service.add).toHaveBeenCalledTimes(1);
  });

  describe('Lifecycle Hooks', () => {
    it(`executes hooks in order if resolves`, async () => {
      const properties: EnvironmentState = { a: 0 };
      const afterProperties: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = { load: () => of(properties) };
      loader = new Loader(service, [source1]);
      loader.preAddProperties = () => afterProperties;
      const source: LoaderSource = loader['loaderSources'][0];

      await expect(loader.load()).toResolve();
      expect(hook).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(hook).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad', source);
      expect(hook).toHaveBeenNthCalledWith(3, 'onBeforeSourceAdd', properties, source);
      expect(hook).toHaveBeenNthCalledWith(4, 'onAfterSourceAdd', afterProperties, source);
      expect(hook).toHaveBeenNthCalledWith(5, 'onAfterSourceComplete', source);
      expect(hook).toHaveBeenNthCalledWith(6, 'onAfterComplete');
      expect(hook).toHaveBeenNthCalledWith(7, 'onAfterLoad');
    });

    it(`executes hooks in order if rejects`, async () => {
      const error: Error = new Error('test');
      const finalError: Error = new Error('The environment source "a" failed to load: test');
      const source1: EnvironmentSource = { id: 'a', isRequired: true, load: () => throwError(() => error) };
      loader = new Loader(service, [source1]);
      const source: LoaderSource = loader['loaderSources'][0];

      await expect(loader.load()).toReject();
      expect(hook).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(hook).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad', source);
      expect(hook).toHaveBeenNthCalledWith(3, 'onAfterSourceError', error, source);
      expect(hook).toHaveBeenNthCalledWith(4, 'onAfterSourceComplete', source);
      expect(hook).toHaveBeenNthCalledWith(5, 'onAfterComplete');
      expect(hook).toHaveBeenNthCalledWith(6, 'onAfterError', finalError);
    });
  });
});
