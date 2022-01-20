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
  timer,
} from 'rxjs';

import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { EnvironmentState } from '../store';
import { TestEnvironmentStore } from '../store/environment-store.gateway.spec';
import { EnvironmentLoader } from './environment-loader.application';
import { environmentSourcesFactory } from './environment-sources-factory.function';

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
  override name = 'ObservableSource';
  load(): Observable<EnvironmentState> {
    return of({ observable: 0 }).pipe(delay(5));
  }
}

const observableSource = environmentSourcesFactory(new ObservableSource());

const observableOrderedSource = environmentSourcesFactory(new ObservableSource());
observableOrderedSource[0].loadInOrder = true;

const observableRequiredOrderedSource = environmentSourcesFactory(new ObservableSource());
observableRequiredOrderedSource[0].requiredToLoad = true;
observableRequiredOrderedSource[0].loadInOrder = true;

const observableRequiredOrderedSource2 = environmentSourcesFactory(new ObservableSource());
observableRequiredOrderedSource2[0].requiredToLoad = true;
observableRequiredOrderedSource2[0].loadInOrder = true;

const observableMergeSource = environmentSourcesFactory(new ObservableSource());
observableMergeSource[0].mergeProperties = true;

const observablePathSource = environmentSourcesFactory(new ObservableSource());
observablePathSource[0].path = 'a.a';

const observableMergePathSource = environmentSourcesFactory(new ObservableSource());
observableMergePathSource[0].mergeProperties = true;
observableMergePathSource[0].path = 'a.a';

class PromiseSource extends EnvironmentSource {
  override name = 'PromiseSource';
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
infiniteRequiredOrderedSource[0].name = 'InfiniteRequiredOrderedSource';
infiniteRequiredOrderedSource[0].requiredToLoad = true;
infiniteRequiredOrderedSource[0].loadInOrder = true;

class MultipleSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return interval(5).pipe(
      map((n) => ({ multiple: n })),
      take(3),
    );
  }
}

const multipleSource = environmentSourcesFactory(new MultipleSource());

const multipleRequiredOrderedSource = environmentSourcesFactory(new MultipleSource());
multipleRequiredOrderedSource[0].name = 'MultipleRequiredOrderedSource';
multipleRequiredOrderedSource[0].requiredToLoad = true;
multipleRequiredOrderedSource[0].loadInOrder = true;

class MultipleArraySource extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }, { b: 0 }, { c: 0 }];
  }
}

const multipleArrayRequiredSource = environmentSourcesFactory(new MultipleArraySource());
multipleArrayRequiredSource[0].requiredToLoad = true;

class ErrorSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return throwError('').pipe(delayThrow(5));
  }
}

const errorSource = environmentSourcesFactory(new ErrorSource());

const errorRequiredSource = environmentSourcesFactory(new ErrorSource());
errorRequiredSource[0].name = 'ErrorRequiredSource';
errorRequiredSource[0].requiredToLoad = true;

const errorOrderedSource = environmentSourcesFactory(new ErrorSource());
errorOrderedSource[0].name = 'ErrorOrderedSource';
errorOrderedSource[0].loadInOrder = true;

const errorRequiredOrderedSource = environmentSourcesFactory(new ErrorSource());
errorRequiredOrderedSource[0].name = 'ErrorRequiredOrderedSource';
errorRequiredOrderedSource[0].requiredToLoad = true;
errorRequiredOrderedSource[0].loadInOrder = true;

const errorIgnoreRequiredSource = environmentSourcesFactory(new ErrorSource());
errorIgnoreRequiredSource[0].ignoreError = true;
errorIgnoreRequiredSource[0].requiredToLoad = true;

class ErrorMessageSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return throwError(() => new Error('111')).pipe(delayThrow(5));
  }
}

const errorMessageRequiredOrderedSource = environmentSourcesFactory(new ErrorMessageSource());
errorMessageRequiredOrderedSource[0].name = 'ErrorMessageRequiredOrderedSource';
errorMessageRequiredOrderedSource[0].requiredToLoad = true;
errorMessageRequiredOrderedSource[0].loadInOrder = true;

class MultipleWithErrorSource extends EnvironmentSource {
  load(): Observable<EnvironmentState> {
    return interval(5).pipe(
      map((n) => {
        if (n === 1) {
          throw new Error();
        }
        return { multiple: n };
      }),
      take(3),
    );
  }
}

const multipleWithErrorOrderedSource = environmentSourcesFactory(new MultipleWithErrorSource());
multipleWithErrorOrderedSource[0].loadInOrder = true;

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

    it(`returns rejected Promise on requiredToLoad source error`, async () => {
      (loader as any)['loaderSources'] = errorRequiredSource;
      await expect(loader.load()).rejects.toThrowError(
        'The Environment EnvironmentSource "ErrorRequiredSource" failed to load',
      );
    });

    it(`returns rejected Promise with message on requiredToLoad source error`, async () => {
      (loader as any)['loaderSources'] = errorMessageRequiredOrderedSource;
      await expect(loader.load()).rejects.toThrowError(
        'The Environment EnvironmentSource "ErrorMessageRequiredOrderedSource" failed to load: 111',
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
      ...observableRequiredOrderedSource2,
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
      expect(loader['requiredToLoadSubject$'].isStopped).toBeFalse();
      jest.advanceTimersByTime(5);
      expect(loader['requiredToLoadSubject$'].isStopped).toBeFalse();
      loader.onDestroy();
      expect(loader['requiredToLoadSubject$'].isStopped).toBeTrue();
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

  describe('EnvironmentSource', () => {
    describe('.requiredToLoad', () => {
      it(`returns resolved Promise immedialely if no requiredToLoad`, async () => {
        (loader as any)['loaderSources'] = observableSource;
        await loader.load().then(() => expect(service.add).not.toHaveBeenCalled());
      });

      it(`returns resolved Promise after all requiredToLoad completes`, async () => {
        (loader as any)['loaderSources'] = [
          ...observableRequiredOrderedSource,
          ...observableRequiredOrderedSource2,
          ...observableOrderedSource,
        ];
        await loader.load().then(() => {
          expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenCalledTimes(2);
        });
      });

      it(`returns resolved Promise after multiple emits requiredToLoad completes`, async () => {
        (loader as any)['loaderSources'] = [
          ...observableRequiredOrderedSource,
          ...multipleRequiredOrderedSource,
          ...observableRequiredOrderedSource2,
          ...observableOrderedSource,
        ];
        await loader.load().then(() => {
          expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenNthCalledWith(2, { multiple: 0 }, undefined);
          expect(service.add).toHaveBeenNthCalledWith(3, { multiple: 1 }, undefined);
          expect(service.add).toHaveBeenNthCalledWith(4, { multiple: 2 }, undefined);
          expect(service.add).toHaveBeenNthCalledWith(5, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenCalledTimes(5);
        });
      });

      it(`doesn't return if infinite requiredToLoad source`, async () => {
        (loader as any)['loaderSources'] = infiniteRequiredOrderedSource;
        let index = 0;
        loader['onAfterSourceAdd'] = () => {
          if (index === 9) {
            loader.resolveLoad();
          } else {
            index++;
          }
        };
        await loader.load().then(() => expect(service.add).toHaveBeenCalledTimes(10));
      });

      it(`returns resolved Promise after load error`, async () => {
        (loader as any)['loaderSources'] = [
          ...observableRequiredOrderedSource,
          ...errorOrderedSource,
          ...observableRequiredOrderedSource2,
        ];
        await loader.load().then(() => {
          expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenCalledTimes(2);
        });
      });

      it(`returns rejected Promise after requiredToLoad load error`, async () => {
        (loader as any)['loaderSources'] = [
          ...observableRequiredOrderedSource,
          ...errorRequiredOrderedSource,
          ...observableRequiredOrderedSource2,
        ];
        const error = new Error('The Environment EnvironmentSource "ErrorRequiredOrderedSource" failed to load');
        await loader.load().catch((err) => {
          expect(err).toEqual(error);
          expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
          expect(service.add).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('.loadInOrder', () => {
      it(`adds properties all at once if no loadInOrder sources`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [...observableSource, ...multipleSource, ...arraySource];
        loader.load();
        expect(service.add).toHaveBeenNthCalledWith(1, { array: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenNthCalledWith(3, { multiple: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(3);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(4, { multiple: 1 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(4);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(5, { multiple: 2 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(5);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(5);
      });

      it(`adds properties in order if loadInOrder and all completes`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [...observableRequiredOrderedSource, ...observableOrderedSource];
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(2);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(2);
      });

      it(`adds properties in order if loadInOrder waiting for multiple emit completes`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [
          ...observableRequiredOrderedSource,
          ...multipleRequiredOrderedSource,
          ...observableOrderedSource,
        ];
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(2, { multiple: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(3, { multiple: 1 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(3);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(4, { multiple: 2 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(4);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(5, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(5);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(5);
      });

      it(`adds properties in order if loadInOrder and source never completes, but never load the next ordered source`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [...infiniteRequiredOrderedSource, ...observableOrderedSource];
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { infinite: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(2, { infinite: 1 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(2);
        jest.advanceTimersByTime(100);
        expect(service.add).toHaveBeenCalledTimes(22);
        expect(service.add).not.toHaveBeenCalledWith({ observable: 0 }, undefined);
      });

      it(`adds properties mixing loadInOrder and no loadInOrder sources`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [
          ...multipleRequiredOrderedSource,
          ...observableOrderedSource,
          ...observableSource,
          ...arraySource,
        ];
        loader.load();
        expect(service.add).toHaveBeenNthCalledWith(1, { array: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenCalledWith({ observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledWith({ multiple: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(3);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(4, { multiple: 1 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(4);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(5, { multiple: 2 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(5);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(6, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(6);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(6);
      });

      it(`adds properties in order ignoring errors`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [...errorOrderedSource, ...observableOrderedSource];
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`adds properties in order ignoring errors and completing multiple sources on error`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = [
          ...multipleWithErrorOrderedSource,
          ...errorOrderedSource,
          ...observableOrderedSource,
        ];
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { multiple: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(2, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(2);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(2);
      });
    });

    describe('.mergeProperties', () => {
      it(`adds properties if no mergeProperties source`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = observableSource;
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`merges properties if mergeProperties source`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = observableMergeSource;
        loader.load();
        expect(service.merge).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.merge).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.merge).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.merge).toHaveBeenCalledTimes(1);
      });
    });

    describe('.ignoreError', () => {
      it(`returns rejected Promise if requiredToLoad source error and no ignoreError`, async () => {
        (loader as any)['loaderSources'] = errorRequiredSource;
        await expect(loader.load()).toReject();
      });

      it(`returns resolved Promise if requiredToLoad source error and ignoreError`, async () => {
        (loader as any)['loaderSources'] = errorIgnoreRequiredSource;
        await expect(loader.load()).toResolve();
      });
    });

    describe('.path', () => {
      it(`adds properties without path`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = observableSource;
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`adds properties with path`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = observablePathSource;
        loader.load();
        expect(service.add).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, 'a.a');
        expect(service.add).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`merges properties with mergeProperties and no path`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = observableMergeSource;
        loader.load();
        expect(service.merge).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.merge).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.merge).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.merge).toHaveBeenCalledTimes(1);
      });

      it(`merges properties with mergeProperties and path`, () => {
        jest.useFakeTimers();
        (loader as any)['loaderSources'] = observableMergePathSource;
        loader.load();
        expect(service.merge).not.toHaveBeenCalled();
        jest.advanceTimersByTime(5);
        expect(service.merge).toHaveBeenNthCalledWith(1, { observable: 0 }, 'a.a');
        expect(service.merge).toHaveBeenCalledTimes(1);
        jest.runAllTimers();
        expect(service.merge).toHaveBeenCalledTimes(1);
      });
    });

    describe('.load()', () => {
      it(`returns resolved Promise from Observable`, async () => {
        (loader as any)['loaderSources'] = observableRequiredOrderedSource;
        await expect(loader.load()).toResolve();
        expect(service.add).toHaveBeenNthCalledWith(1, { observable: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`returns resolved Promise from Promise`, async () => {
        (loader as any)['loaderSources'] = promiseSource;
        await expect(loader.load()).toResolve();
        expect(service.add).toHaveBeenNthCalledWith(1, { promise: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`returns resolved Promise from Array`, async () => {
        (loader as any)['loaderSources'] = arraySource;
        await expect(loader.load()).toResolve();
        expect(service.add).toHaveBeenNthCalledWith(1, { array: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(1);
      });

      it(`returns resolved Promise from multiple Array`, async () => {
        (loader as any)['loaderSources'] = multipleArrayRequiredSource;
        await expect(loader.load()).toResolve();
        expect(service.add).toHaveBeenNthCalledWith(1, { a: 0 }, undefined);
        expect(service.add).toHaveBeenNthCalledWith(2, { b: 0 }, undefined);
        expect(service.add).toHaveBeenNthCalledWith(3, { c: 0 }, undefined);
        expect(service.add).toHaveBeenCalledTimes(3);
      });
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
        (loader as any)['loaderSources'][0],
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
        (loader as any)['loaderSources'][0],
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
        new Error('The Environment EnvironmentSource "ErrorRequiredOrderedSource" failed to load'),
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
        (loader as any)['loaderSources'][0],
      );
    });

    it(`onAfterSourceAdd(properties, source) is called with properties and source`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onAfterSourceAdd).toHaveBeenNthCalledWith(
        1,
        { observable: 0 },
        (loader as any)['loaderSources'][0],
      );
    });

    it(`onAfterSourceError(error, source) is called with error and source`, async () => {
      (loader as any)['loaderSources'] = errorRequiredOrderedSource;
      await expect(loader.load()).toReject();
      expect(loader.onAfterSourceError).toHaveBeenNthCalledWith(
        1,
        new Error('The Environment EnvironmentSource "ErrorRequiredOrderedSource" failed to load'),
        (loader as any)['loaderSources'][0],
      );
    });

    it(`onAfterSourceComplete(source) is called with source`, async () => {
      (loader as any)['loaderSources'] = observableRequiredOrderedSource;
      await expect(loader.load()).toResolve();
      expect(loader.onAfterSourceComplete).toHaveBeenNthCalledWith(1, (loader as any)['loaderSources'][0]);
    });
  });
});
