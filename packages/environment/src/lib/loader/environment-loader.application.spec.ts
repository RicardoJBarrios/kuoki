import { omit } from 'lodash';
import {
  catchError,
  delay,
  interval,
  map,
  mergeMap,
  MonoTypeOperatorFunction,
  Observable,
  of,
  take,
  throwError,
  timer
} from 'rxjs';

import { EnvironmentService } from '../service';
import { EnvironmentSource, SourceStrategy } from '../source';
import { EnvironmentState, EnvironmentStore } from '../store';
import { EnvironmentLoader } from './environment-loader.application';
import { environmentSourcesFactory } from './environment-sources-factory.function';

export class TestEnvironmentStore extends EnvironmentStore {
  getAll$(): Observable<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
  getAll(): EnvironmentState {
    throw new Error('Method not implemented.');
  }
  update(environment: EnvironmentState): void {
    throw new Error('Method not implemented.');
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }
}

function delayThrow<T>(due: number | Date): MonoTypeOperatorFunction<T> {
  return catchError(<E>(error: E) => timer(due).pipe(mergeMap(() => throwError(() => error))));
}

class TestLoader extends EnvironmentLoader {
  constructor(protected override service: EnvironmentService, protected override sources?: any) {
    super(service, sources);
  }

  onBeforeLoad() {}
  onAfterLoad() {}
  onAfterError() {}
  onAfterComplete() {}
  onBeforeSourceLoad() {}
  onBeforeSourceAdd() {}
  onAfterSourceAdd() {}
  onAfterSourceError() {}
  onAfterSourceComplete() {}
}

class ObservableSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return of({ observable: 0 }).pipe(delay(5));
  }
}

const observableSource = environmentSourcesFactory(new ObservableSource());

const observableOrderedSource = environmentSourcesFactory(new ObservableSource());
observableOrderedSource[0].isOrdered = true;

const observableRequiredOrderedSource = environmentSourcesFactory(new ObservableSource());
observableRequiredOrderedSource[0].isRequired = true;
observableRequiredOrderedSource[0].isOrdered = true;

const observableRequiredOrderedSource2 = environmentSourcesFactory(new ObservableSource());
observableRequiredOrderedSource2[0].isRequired = true;
observableRequiredOrderedSource2[0].isOrdered = true;

const observableMergeSource = environmentSourcesFactory(new ObservableSource());
observableMergeSource[0].strategy = SourceStrategy.MERGE;

const observablePathSource = environmentSourcesFactory(new ObservableSource());
observablePathSource[0].path = 'a.a';

const observableMergePathSource = environmentSourcesFactory(new ObservableSource());
observableMergePathSource[0].strategy = SourceStrategy.MERGE;
observableMergePathSource[0].path = 'a.a';

class PromiseSource extends EnvironmentSource {
  async load(): Promise<EnvironmentState> {
    return Promise.resolve({ promise: 0 });
  }
}

const promiseSource = environmentSourcesFactory(new PromiseSource());

class ArraySource extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ array: 0 }];
  }
}

const arraySource = environmentSourcesFactory(new ArraySource());

class InfiniteSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return interval(5).pipe(map((n) => ({ infinite: n })));
  }
}

const infiniteRequiredOrderedSource = environmentSourcesFactory(new InfiniteSource());
infiniteRequiredOrderedSource[0].id = 'InfiniteRequiredOrderedSource';
infiniteRequiredOrderedSource[0].isRequired = true;
infiniteRequiredOrderedSource[0].isOrdered = true;

class MultipleSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return interval(5).pipe(
      map((n) => ({ multiple: n })),
      take(3)
    );
  }
}

const multipleSource = environmentSourcesFactory(new MultipleSource());

const multipleRequiredOrderedSource = environmentSourcesFactory(new MultipleSource());
multipleRequiredOrderedSource[0].id = 'MultipleRequiredOrderedSource';
multipleRequiredOrderedSource[0].isRequired = true;
multipleRequiredOrderedSource[0].isOrdered = true;

class MultipleArraySource extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }, { b: 0 }, { c: 0 }];
  }
}

const multipleArrayRequiredSource = environmentSourcesFactory(new MultipleArraySource());
multipleArrayRequiredSource[0].isRequired = true;

class ErrorSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return throwError(() => '').pipe(delayThrow(5));
  }
}

const errorSource = environmentSourcesFactory(new ErrorSource());

const errorRequiredSource = environmentSourcesFactory(new ErrorSource());
errorRequiredSource[0].id = 'ErrorRequiredSource';
errorRequiredSource[0].isRequired = true;

const errorOrderedSource = environmentSourcesFactory(new ErrorSource());
errorOrderedSource[0].id = 'ErrorOrderedSource';
errorOrderedSource[0].isOrdered = true;

const errorRequiredOrderedSource = environmentSourcesFactory(new ErrorSource());
errorRequiredOrderedSource[0].id = 'ErrorRequiredOrderedSource';
errorRequiredOrderedSource[0].isRequired = true;
errorRequiredOrderedSource[0].isOrdered = true;

const errorIgnoreRequiredSource = environmentSourcesFactory(new ErrorSource());
errorIgnoreRequiredSource[0].ignoreError = true;
errorIgnoreRequiredSource[0].isRequired = true;

class ErrorMessageSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return throwError(() => new Error('111')).pipe(delayThrow(5));
  }
}

const errorMessageRequiredOrderedSource = environmentSourcesFactory(new ErrorMessageSource());
errorMessageRequiredOrderedSource[0].id = 'ErrorMessageRequiredOrderedSource';
errorMessageRequiredOrderedSource[0].isRequired = true;
errorMessageRequiredOrderedSource[0].isOrdered = true;

class MultipleWithErrorSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return interval(5).pipe(
      map((n) => {
        if (n === 1) {
          throw new Error();
        }
        return { multiple: n };
      }),
      take(3)
    );
  }
}

const multipleWithErrorOrderedSource = environmentSourcesFactory(new MultipleWithErrorSource());
multipleWithErrorOrderedSource[0].isOrdered = true;

describe('EnvironmentLoader', () => {
  let service: EnvironmentService;
  let loader: TestLoader;

  beforeEach(() => {
    service = new EnvironmentService(new TestEnvironmentStore());
    loader = new TestLoader(service);
    jest.spyOn(service as any, 'add').mockImplementation((p) => null);
    jest.spyOn(service as any, 'merge').mockImplementation(() => null);
    jest.spyOn(loader, 'onBeforeLoad').mockImplementation(() => null);
    jest.spyOn(loader, 'onAfterLoad').mockImplementation(() => null);
    jest.spyOn(loader, 'onAfterError').mockImplementation(() => null);
    jest.spyOn(loader, 'onAfterComplete').mockImplementation(() => null);
    jest.spyOn(loader, 'onBeforeSourceLoad').mockImplementation(() => null);
    jest.spyOn(loader, 'onBeforeSourceAdd').mockImplementation(() => null);
    jest.spyOn(loader, 'onAfterSourceAdd').mockImplementation(() => null);
    jest.spyOn(loader, 'onAfterSourceError').mockImplementation(() => null);
    jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it(`['loaderSources'] is set on constructor`, async () => {
    loader = new TestLoader(service, [new ObservableSource(), new PromiseSource()]);
    const source0 = observableSource[0];
    const source1 = promiseSource[0];
    expect((loader as any)['loaderSources']).toBeArrayOfSize(2);
    expect((loader as any)['loaderSources'][0]).toEqual(expect.objectContaining(omit(source0, 'id')));
    expect((loader as any)['loaderSources'][1]).toEqual(expect.objectContaining(omit(source1, 'id')));
    await expect(loader.load()).toResolve();
  });

  it(`.sourcesSubject$ is set on constructor`, async () => {
    loader = new TestLoader(service, [new ObservableSource(), new PromiseSource()]);
    const source0 = (loader as any)['loaderSources'][0];
    const source1 = (loader as any)['loaderSources'][1];
    expect((loader as any)['sourcesSubject$'].size).toEqual(2);
    expect([...(loader as any)['sourcesSubject$'].keys()]).toEqual([source0.id, source1.id]);
    await expect(loader.load()).toResolve();
  });

  describe('.load()', () => {
    it(`returns resolved Promise if no sources`, async () => {
      (loader as any)['loaderSources'] = [];
      await expect(loader.load()).toResolve();
    });

    it(`returns resolved Promise on sources load`, async () => {
      (loader as any)['loaderSources'] = observableSource;
      await expect(loader.load()).toResolve();
    });

    it(`returns resolved Promise on source error`, async () => {
      (loader as any)['loaderSources'] = errorSource;
      await expect(loader.load()).toResolve();
    });

    it(`returns rejected Promise on isRequired source error`, async () => {
      (loader as any)['loaderSources'] = errorRequiredSource;
      await expect(loader.load()).rejects.toThrowError(
        'The Environment EnvironmentSource "ErrorRequiredSource" failed to load'
      );
    });

    it(`returns rejected Promise with message on isRequired source error`, async () => {
      (loader as any)['loaderSources'] = errorMessageRequiredOrderedSource;
      await expect(loader.load()).rejects.toThrowError(
        'The Environment EnvironmentSource "ErrorMessageRequiredOrderedSource" failed to load: 111'
      );
    });
  });

  describe('.resolveLoad()', () => {
    const resolveSources = [...observableRequiredOrderedSource, ...observableRequiredOrderedSource2];

    beforeEach(() => {
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => loader.resolveLoad());
    });

    it(`forces the load to resolve`, async () => {
      (loader as any)['loaderSources'] = resolveSources;
      expect(service.add).not.toHaveBeenCalled();
      await expect(loader.load()).toResolve();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`continues loading sources`, () => {
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = resolveSources;
      loader.load();
      jest.runAllTimers();
      expect(service.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('.rejectLoad()', () => {
    const resolveSources = [...observableRequiredOrderedSource, ...observableRequiredOrderedSource2];

    beforeEach(() => {
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => loader.rejectLoad(''));
    });

    it(`forces the load to reject`, async () => {
      (loader as any)['loaderSources'] = resolveSources;
      expect(service.add).not.toHaveBeenCalled();
      await expect(loader.load()).toReject();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`continues loading sources`, () => {
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = resolveSources;
      loader.load().catch(() => null);
      jest.runAllTimers();
      expect(service.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('.completeAllSources()', () => {
    const completeSources = [...observableRequiredOrderedSource, ...observableRequiredOrderedSource2];

    beforeEach(() => {
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => loader.completeAllSources());
    });

    it(`forces the load to resolve`, async () => {
      (loader as any)['loaderSources'] = completeSources;
      expect(service.add).not.toHaveBeenCalled();
      await expect(loader.load()).toResolve();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`stops all ongoing source loads`, () => {
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = completeSources;
      loader.load();
      jest.runAllTimers();
      expect(service.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('.completeSource(source)', () => {
    const completeSources = [
      ...observableRequiredOrderedSource,
      ...multipleRequiredOrderedSource,
      ...observableRequiredOrderedSource2
    ];

    it(`forces the load to resolve`, async () => {
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => {
        loader.completeSource(multipleRequiredOrderedSource[0]);
      });
      (loader as any)['loaderSources'] = completeSources;
      expect(service.add).not.toHaveBeenCalled();
      await expect(loader.load()).toResolve();
      expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenCalledTimes(2);
    });

    it(`stops the source load`, () => {
      jest
        .spyOn(loader, 'onAfterSourceComplete')
        .mockImplementation(() => loader.completeSource(multipleRequiredOrderedSource[0]));
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = completeSources;
      loader.load();
      jest.runAllTimers();
      expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenCalledTimes(2);
    });

    it(`does nothing if the id doesn't exist`, () => {
      jest
        .spyOn(loader, 'onAfterSourceComplete')
        .mockImplementation(() => loader.completeSource(environmentSourcesFactory(new ObservableSource())[0]));
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = completeSources;
      loader.load();
      jest.runAllTimers();
      expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(2, { multiple: 0 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(3, { multiple: 1 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(4, { multiple: 2 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(5, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenCalledTimes(5);
    });

    it(`doesn't throw error if source subject is not setted`, () => {
      const id = multipleRequiredOrderedSource[0].id;
      jest
        .spyOn(loader, 'onAfterSourceComplete')
        .mockImplementation(() => loader.completeSource(multipleRequiredOrderedSource[0]));
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = completeSources;
      (loader as any)['sourcesSubject$'] = new Map();
      loader.load();
      jest.runAllTimers();
      expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
      expect(service.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('.onDestroy()', () => {
    const onDestroySources = [...observableRequiredOrderedSource, ...observableRequiredOrderedSource2];

    it(`forces the load to resolve`, async () => {
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => loader.onDestroy());
      (loader as any)['loaderSources'] = onDestroySources;
      expect(service.add).not.toHaveBeenCalled();
      await expect(loader.load()).toResolve();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`stops all ongoing source loads`, () => {
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => loader.onDestroy());
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = onDestroySources;
      loader.load();
      jest.runAllTimers();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`completes the load subject`, () => {
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = onDestroySources;
      loader.load();
      expect(loader['loadSubject$'].isStopped).toBeFalse();
      jest.advanceTimersByTime(5);
      expect(loader['loadSubject$'].isStopped).toBeFalse();
      loader.onDestroy();
      expect(loader['loadSubject$'].isStopped).toBeTrue();
    });

    it(`completes the required to load subject`, () => {
      jest.useFakeTimers();
      (loader as any)['loaderSources'] = onDestroySources;
      loader.load();
      expect(loader['isRequiredSubject$'].isStopped).toBeFalse();
      jest.advanceTimersByTime(5);
      expect(loader['isRequiredSubject$'].isStopped).toBeFalse();
      loader.onDestroy();
      expect(loader['isRequiredSubject$'].isStopped).toBeTrue();
    });

    it(`completes the sources subjects`, () => {
      jest.useFakeTimers();
      const id1 = observableRequiredOrderedSource[0].id;
      const id2 = observableRequiredOrderedSource2[0].id;
      (loader as any)['loaderSources'] = onDestroySources;
      loader.load();
      expect((loader as any)['sourcesSubject$'].get(id1).isStopped).toBeFalse();
      expect((loader as any)['sourcesSubject$'].get(id2).isStopped).toBeFalse();
      jest.advanceTimersByTime(5);
      expect((loader as any)['sourcesSubject$'].get(id1).isStopped).toBeFalse();
      expect((loader as any)['sourcesSubject$'].get(id2).isStopped).toBeFalse();
      loader.onDestroy();
      expect((loader as any)['sourcesSubject$'].get(id1).isStopped).toBeTrue();
      expect((loader as any)['sourcesSubject$'].get(id2).isStopped).toBeTrue();
    });
  });

  describe('Middleware', () => {
    it(`preAddProperties(properties, source) is called with properties and source`, async () => {
      jest.spyOn(loader, 'preAddProperties').mockImplementation((p) => p);
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.preAddProperties).toHaveBeenNthCalledWith(
        1,
        { observable: 0 },
        (loader as any)['loaderSources'][0]
      );
      expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
    });

    it(`preAddProperties(properties, source) modifies the properties`, async () => {
      jest.spyOn(loader, 'preAddProperties').mockImplementation(() => ({ middleware: 0 }));
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.preAddProperties).toHaveBeenNthCalledWith(
        1,
        { observable: 0 },
        (loader as any)['loaderSources'][0]
      );
      expect(service.add).toHaveBeenNthCalledWith(1, { middleware: 0 }, undefined);
    });
  });

  describe('Lifecycle Hooks', () => {
    it(`executes load lifecycle hooks in order if no error`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeLoad').mockImplementation(() => console.log('onBeforeLoad'));
      jest.spyOn(loader, 'onAfterComplete').mockImplementation(() => console.log('onAfterComplete'));
      jest.spyOn(loader, 'onAfterLoad').mockImplementation(() => console.log('onAfterLoad'));
      jest.spyOn(loader, 'onAfterError').mockImplementation(() => console.log('onAfterError'));
      await expect(loader.load()).toResolve();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onAfterComplete');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterLoad');
      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it(`executes load lifecycle hooks in order if error`, async () => {
      (loader as any)['loaderSources'] = errorRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeLoad').mockImplementation(() => console.log('onBeforeLoad'));
      jest.spyOn(loader, 'onAfterComplete').mockImplementation(() => console.log('onAfterComplete'));
      jest.spyOn(loader, 'onAfterLoad').mockImplementation(() => console.log('onAfterLoad'));
      jest.spyOn(loader, 'onAfterError').mockImplementation(() => console.log('onAfterError'));
      await expect(loader.load()).toReject();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onAfterComplete');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterError');
      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it(`executes source lifecycle hooks in order if no error`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeSourceLoad').mockImplementation(() => console.log('onBeforeSourceLoad'));
      jest.spyOn(loader, 'onBeforeSourceAdd').mockImplementation(() => console.log('onBeforeSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceAdd').mockImplementation(() => console.log('onAfterSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceError').mockImplementation(() => console.log('onAfterSourceError'));
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => console.log('onAfterSourceComplete'));
      await expect(loader.load()).toResolve();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeSourceLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onBeforeSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(4, 'onAfterSourceComplete');
      expect(console.log).toHaveBeenCalledTimes(4);
    });

    it(`executes multiple source lifecycle hooks in order if no error`, async () => {
      (loader as any)['loaderSources'] = multipleRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeSourceLoad').mockImplementation(() => console.log('onBeforeSourceLoad'));
      jest.spyOn(loader, 'onBeforeSourceAdd').mockImplementation(() => console.log('onBeforeSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceAdd').mockImplementation(() => console.log('onAfterSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceError').mockImplementation(() => console.log('onAfterSourceError'));
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => console.log('onAfterSourceComplete'));
      await expect(loader.load()).toResolve();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeSourceLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onBeforeSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(4, 'onBeforeSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(5, 'onAfterSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(6, 'onBeforeSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(7, 'onAfterSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(8, 'onAfterSourceComplete');
      expect(console.log).toHaveBeenCalledTimes(8);
    });

    it(`executes source lifecycle hooks in order if error`, async () => {
      (loader as any)['loaderSources'] = errorRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeSourceLoad').mockImplementation(() => console.log('onBeforeSourceLoad'));
      jest.spyOn(loader, 'onBeforeSourceAdd').mockImplementation(() => console.log('onBeforeSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceAdd').mockImplementation(() => console.log('onAfterSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceError').mockImplementation(() => console.log('onAfterSourceError'));
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => console.log('onAfterSourceComplete'));
      await expect(loader.load()).toReject();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeSourceLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onAfterSourceError');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterSourceComplete');
      expect(console.log).toHaveBeenCalledTimes(3);
    });

    it(`executes full lifecycle hooks in order if no error`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeLoad').mockImplementation(() => console.log('onBeforeLoad'));
      jest.spyOn(loader, 'onAfterComplete').mockImplementation(() => console.log('onAfterComplete'));
      jest.spyOn(loader, 'onAfterLoad').mockImplementation(() => console.log('onAfterLoad'));
      jest.spyOn(loader, 'onAfterError').mockImplementation(() => console.log('onAfterError'));
      jest.spyOn(loader, 'onBeforeSourceLoad').mockImplementation(() => console.log('onBeforeSourceLoad'));
      jest.spyOn(loader, 'onBeforeSourceAdd').mockImplementation(() => console.log('onBeforeSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceAdd').mockImplementation(() => console.log('onAfterSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceError').mockImplementation(() => console.log('onAfterSourceError'));
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => console.log('onAfterSourceComplete'));
      await expect(loader.load()).toResolve();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onBeforeSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(4, 'onAfterSourceAdd');
      expect(console.log).toHaveBeenNthCalledWith(5, 'onAfterSourceComplete');
      expect(console.log).toHaveBeenNthCalledWith(6, 'onAfterComplete');
      expect(console.log).toHaveBeenNthCalledWith(7, 'onAfterLoad');
      expect(console.log).toHaveBeenCalledTimes(7);
    });

    it(`executes full lifecycle hooks in order if error`, async () => {
      (loader as any)['loaderSources'] = errorRequiredOrderedSource;
      jest.spyOn(console, 'log').mockImplementation(() => null);
      jest.spyOn(loader, 'onBeforeLoad').mockImplementation(() => console.log('onBeforeLoad'));
      jest.spyOn(loader, 'onAfterComplete').mockImplementation(() => console.log('onAfterComplete'));
      jest.spyOn(loader, 'onAfterLoad').mockImplementation(() => console.log('onAfterLoad'));
      jest.spyOn(loader, 'onAfterError').mockImplementation(() => console.log('onAfterError'));
      jest.spyOn(loader, 'onBeforeSourceLoad').mockImplementation(() => console.log('onBeforeSourceLoad'));
      jest.spyOn(loader, 'onBeforeSourceAdd').mockImplementation(() => console.log('onBeforeSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceAdd').mockImplementation(() => console.log('onAfterSourceAdd'));
      jest.spyOn(loader, 'onAfterSourceError').mockImplementation(() => console.log('onAfterSourceError'));
      jest.spyOn(loader, 'onAfterSourceComplete').mockImplementation(() => console.log('onAfterSourceComplete'));
      await expect(loader.load()).toReject();
      expect(console.log).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
      expect(console.log).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad');
      expect(console.log).toHaveBeenNthCalledWith(3, 'onAfterSourceError');
      expect(console.log).toHaveBeenNthCalledWith(4, 'onAfterSourceComplete');
      expect(console.log).toHaveBeenNthCalledWith(5, 'onAfterComplete');
      expect(console.log).toHaveBeenNthCalledWith(6, 'onAfterError');
      expect(console.log).toHaveBeenCalledTimes(6);
    });

    it(`onBeforeLoad() is called without args`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onBeforeLoad).toHaveBeenNthCalledWith(1);
    });

    it(`onAfterLoad() is called without args `, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onAfterLoad).toHaveBeenNthCalledWith(1);
    });

    it(`onAfterError(error) is called with error`, async () => {
      (loader as any)['loaderSources'] = errorRequiredOrderedSource;
      await expect(loader.load()).toReject();
      expect(loader.onAfterError).toHaveBeenNthCalledWith(
        1,
        new Error('The Environment EnvironmentSource "ErrorRequiredOrderedSource" failed to load')
      );
    });

    it(`onAfterComplete() is called without args `, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onAfterComplete).toHaveBeenNthCalledWith(1);
    });

    it(`onBeforeSourceLoad(source) is called with source`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onBeforeSourceLoad).toHaveBeenNthCalledWith(1, (loader as any)['loaderSources'][0]);
    });

    it(`onBeforeSourceAdd(properties, source) is called with properties and source`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onBeforeSourceAdd).toHaveBeenNthCalledWith(
        1,
        { observable: 0 },
        (loader as any)['loaderSources'][0]
      );
    });

    it(`onAfterSourceAdd(properties, source) is called with properties and source`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onAfterSourceAdd).toHaveBeenNthCalledWith(
        1,
        { observable: 0 },
        (loader as any)['loaderSources'][0]
      );
    });

    it(`onAfterSourceError(error, source) is called with error and source`, async () => {
      (loader as any)['loaderSources'] = errorRequiredOrderedSource;
      await expect(loader.load()).toReject();
      expect(loader.onAfterSourceError).toHaveBeenNthCalledWith(
        1,
        new Error('The Environment EnvironmentSource "ErrorRequiredOrderedSource" failed to load'),
        (loader as any)['loaderSources'][0]
      );
    });

    it(`onAfterSourceComplete(source) is called with source`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onAfterSourceComplete).toHaveBeenNthCalledWith(1, (loader as any)['loaderSources'][0]);
    });
  });
});
