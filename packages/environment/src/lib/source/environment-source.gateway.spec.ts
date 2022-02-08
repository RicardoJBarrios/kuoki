import { install, InstalledClock } from '@sinonjs/fake-timers';
import {
  asyncScheduler,
  BehaviorSubject,
  catchError,
  delay,
  interval,
  map,
  of,
  scheduled,
  take,
  throwError
} from 'rxjs';

import { SourceStrategy } from '.';
import { EnvironmentLoader } from '../loader';
import { EnvironmentService } from '../service';
import { EnvironmentStore } from '../store';

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

describe('EnvironmentSource integration with EnvironmentLoader', () => {
  let store: EnvironmentStore;
  let service: EnvironmentService;
  let loader: EnvironmentLoader;
  let clock: InstalledClock;
  let load: jest.Mock<any, any>;

  beforeEach(() => {
    store = new TestEnvironmentStore();
    service = new EnvironmentService(store);
    clock = install();
    load = jest.fn();
  });

  afterEach(() => {
    clock.uninstall();
    jest.restoreAllMocks();
    load.mockRestore();
  });

  describe('load() and isRequired', () => {
    it(`resolves after all required sources are completed`, async () => {
      const source1 = {
        isRequired: true,
        load: () => of({ a: 0 }).pipe(delay(10))
      };
      const source2 = {
        isRequired: true,
        load: () =>
          interval(10).pipe(
            map((v) => ({ b: v })),
            take(3)
          )
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ a: 0, b: 0 });

      await clock.tickAsync(10); // 20
      expect(load).not.toHaveBeenCalled();
      expect(store.getAll()).toEqual({ a: 0, b: 1 });

      await clock.tickAsync(10); // 30
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({ a: 0, b: 2 });
    });

    it(`resolves immedialely if there is no required sources`, async () => {
      const source1 = { load: () => of({ a: 0 }).pipe(delay(10)) };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ a: 0 });
    });

    it(`never resolves if a required source doesn't complete`, async () => {
      const source1 = {
        isRequired: true,
        load: () => interval(10).pipe(map((v) => ({ a: v })))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().finally(() => load());

      await clock.tickAsync(100); // 100
      expect(load).not.toHaveBeenCalled();
    });

    it(`rejects after a required source error`, async () => {
      const source1 = {
        isRequired: true,
        load: () => throwError(() => new Error())
      };
      const source2 = {
        isRequired: true,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().catch(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ b: 0 });
    });

    it(`resolves after a no required source error`, async () => {
      const source1 = { load: () => throwError(() => new Error()) };
      const source2 = {
        isRequired: true,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).not.toHaveBeenCalled();
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({ b: 0 });
    });
  });

  describe('load() and isOrdered', () => {
    it(`wait for another source to complete to start the load`, async () => {
      const source1 = {
        isOrdered: true,
        load: () =>
          interval(10).pipe(
            map((v) => ({ a: v })),
            take(3)
          )
      };
      const source2 = {
        isOrdered: true,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(30); // 30
      expect(store.getAll()).toEqual({ a: 2 });

      await clock.tickAsync(10); // 40
      expect(store.getAll()).toEqual({ a: 2, b: 0 });
    });

    it(`unordered sources add all properties at once`, async () => {
      const source1 = { load: () => of({ a: 0 }).pipe(delay(10)) };
      const source2 = { load: () => of({ b: 0 }).pipe(delay(10)) };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ a: 0, b: 0 });
    });

    it(`never loads if previous ordered source doesn't complete`, async () => {
      const source1 = {
        isOrdered: true,
        load: () => interval(10).pipe(map((v) => ({ a: v })))
      };
      const source2 = {
        isOrdered: true,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ a: 0 });

      await clock.tickAsync(90); // 100
      expect(store.getAll()).toEqual({ a: 9 });
    });

    it(`ignore errors and continues with the next ordered source`, async () => {
      const source1 = {
        isOrdered: true,
        load: () => throwError(() => new Error())
      };
      const source2 = {
        isOrdered: true,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ b: 0 });
    });
  });

  describe('load() and ignoreError', () => {
    it(`ignores the error if the required source throws`, async () => {
      const source1 = {
        isRequired: true,
        ignoreError: true,
        load: () => throwError(() => new Error())
      };
      const source2 = {
        isRequired: true,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).not.toHaveBeenCalled();
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({ b: 0 });
    });
  });

  describe('load() and strategy', () => {
    it(`adds the properties if SourceStrategy.ADD`, async () => {
      const source1 = {
        strategy: SourceStrategy.ADD,
        load: () => of({ a: { a: 0 } }).pipe(delay(10))
      };
      const source2 = {
        strategy: SourceStrategy.ADD,
        load: () => of({ a: { b: 0 } }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ a: { b: 0 } });
    });

    it(`merges the properties if SourceStrategy.MERGE`, async () => {
      const source1 = {
        strategy: SourceStrategy.MERGE,
        load: () => of({ a: { a: 0 } }).pipe(delay(10))
      };
      const source2 = {
        strategy: SourceStrategy.MERGE,
        load: () => of({ a: { b: 0 } }).pipe(delay(10))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(10); // 10
      expect(store.getAll()).toEqual({ a: { a: 0, b: 0 } });
    });
  });

  describe('load() and path', () => {
    it(`sets the properties using path`, async () => {
      jest.spyOn(service, 'add');
      jest.spyOn(service, 'merge');
      const source1 = {
        path: 'a',
        load: () => of({ a: 0 }).pipe(delay(5))
      };
      const source2 = {
        path: 'a',
        strategy: SourceStrategy.MERGE,
        load: () => of({ b: 0 }).pipe(delay(10))
      };
      const source3 = { load: () => of({ c: 0 }).pipe(delay(15)) };
      const source4 = {
        strategy: SourceStrategy.MERGE,
        load: () => of({ d: 0 }).pipe(delay(20))
      };
      loader = new EnvironmentLoader(service, [source1, source2, source3, source4]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(service.add).not.toHaveBeenCalled();
      expect(service.merge).not.toHaveBeenCalled();
      expect(store.getAll()).toEqual({});

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenNthCalledWith(1, { a: 0 }, 'a');
      expect(service.merge).not.toHaveBeenCalled();
      expect(store.getAll()).toEqual({ a: { a: 0 } });

      await clock.tickAsync(5); // 10
      expect(service.add).toHaveBeenCalledTimes(1);
      expect(service.merge).toHaveBeenNthCalledWith(1, { b: 0 }, 'a');
      expect(store.getAll()).toEqual({ a: { a: 0, b: 0 } });

      await clock.tickAsync(5); // 15
      expect(service.add).toHaveBeenNthCalledWith(2, { c: 0 }, undefined);
      expect(service.merge).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({ a: { a: 0, b: 0 }, c: 0 });

      await clock.tickAsync(5); // 20
      expect(service.add).toHaveBeenCalledTimes(2);
      expect(service.merge).toHaveBeenNthCalledWith(2, { d: 0 }, undefined);
      expect(store.getAll()).toEqual({ a: { a: 0, b: 0 }, c: 0, d: 0 });
    });
  });

  describe('fallback sources', () => {
    it(`using catch`, async () => {
      const source1 = {
        load: async () => Promise.reject().catch(() => Promise.resolve({ a: 0 }))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({ a: 0 });
    });

    it(`using catchError`, async () => {
      const source1 = {
        load: () => throwError(() => new Error()).pipe(catchError(() => scheduled([{ a: 0 }], asyncScheduler)))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(store.getAll()).toEqual({ a: 0 });
    });
  });
});
