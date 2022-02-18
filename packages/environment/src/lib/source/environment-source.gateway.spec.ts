import { install, InstalledClock } from '@sinonjs/fake-timers';
import createMockInstance from 'jest-create-mock-instance';
import { catchError, delay, interval, map, of, take, throwError } from 'rxjs';

import { EnvironmentLoader } from '../loader';
import { EnvironmentService } from '../service';
import { EnvironmentState } from '../store';
import { EnvironmentSource } from './environment-source.gateway';
import { SourceStrategy } from './source-strategy.enum';

describe('EnvironmentSource integration with EnvironmentLoader', () => {
  let service: jest.Mocked<EnvironmentService>;
  let loader: EnvironmentLoader;
  let clock: InstalledClock;
  let load: jest.Mock<any, any>;

  beforeEach(() => {
    service = createMockInstance(EnvironmentService);
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
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = {
        isRequired: true,
        load: () => of(state1).pipe(delay(5))
      };
      const source2: EnvironmentSource = {
        isRequired: true,
        load: () =>
          interval(5).pipe(
            map((v) => ({ b: v })),
            take(3)
          )
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenCalledWith(state1, undefined);
      expect(service.add).toHaveBeenCalledWith({ b: 0 }, undefined);

      await clock.tickAsync(5); // 10
      expect(load).not.toHaveBeenCalled();
      expect(service.add).toHaveBeenNthCalledWith(3, { b: 1 }, undefined);

      await clock.tickAsync(5); // 15
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenNthCalledWith(4, { b: 2 }, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(4);
    });

    it(`never resolves if a required source doesn't complete`, async () => {
      const source1: EnvironmentSource = {
        isRequired: true,
        load: () => interval(10).pipe(map((v) => ({ a: v })))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().finally(() => load());

      await clock.tickAsync(100); // 100
      expect(load).not.toHaveBeenCalled();
    });

    it(`rejects after a required source error`, async () => {
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = {
        isRequired: true,
        load: () => throwError(() => new Error())
      };
      const source2: EnvironmentSource = {
        isRequired: true,
        load: () => of(state2).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().catch(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenNthCalledWith(1, state2, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`resolves after a no required source error`, async () => {
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = { load: () => throwError(() => new Error()) };
      const source2: EnvironmentSource = {
        isRequired: true,
        load: () => of(state2).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).not.toHaveBeenCalled();
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenNthCalledWith(1, state2, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('load() and isOrdered', () => {
    it(`wait for another source to complete to start the load`, async () => {
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = {
        isOrdered: true,
        load: () =>
          interval(5).pipe(
            map((v) => ({ a: v })),
            take(3)
          )
      };
      const source2: EnvironmentSource = {
        isOrdered: true,
        load: () => of(state2).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(15); // 15
      expect(service.add).toHaveBeenNthCalledWith(1, { a: 0 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(2, { a: 1 }, undefined);
      expect(service.add).toHaveBeenNthCalledWith(3, { a: 2 }, undefined);

      await clock.tickAsync(5); // 20
      expect(service.add).toHaveBeenNthCalledWith(4, state2, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(4);
    });

    it(`unordered sources add all properties at once`, async () => {
      const state1: EnvironmentState = { b: 0 };
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = { load: () => of(state1).pipe(delay(5)) };
      const source2: EnvironmentSource = { load: () => of(state2).pipe(delay(5)) };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenCalledWith(state1, undefined);
      expect(service.add).toHaveBeenCalledWith(state2, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(2);
    });

    it(`never loads if previous ordered source doesn't complete`, async () => {
      const source1: EnvironmentSource = {
        isOrdered: true,
        load: () => interval(5).pipe(map((v) => ({ a: v })))
      };
      const source2: EnvironmentSource = {
        isOrdered: true,
        load: () => of({ b: 0 }).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenNthCalledWith(1, { a: 0 }, undefined);

      await clock.tickAsync(95); // 100
      expect(service.add).toHaveBeenNthCalledWith(20, { a: 19 }, undefined);
    });

    it(`ignore errors and continues with the next ordered source`, async () => {
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = {
        isOrdered: true,
        load: () => throwError(() => new Error())
      };
      const source2: EnvironmentSource = {
        isOrdered: true,
        load: () => of(state2).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenNthCalledWith(1, state2, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('load() and ignoreError', () => {
    it(`ignores the error if the required source throws`, async () => {
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = {
        isRequired: true,
        ignoreError: true,
        load: () => throwError(() => new Error())
      };
      const source2: EnvironmentSource = {
        isRequired: true,
        load: () => of(state2).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).not.toHaveBeenCalled();
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenNthCalledWith(1, state2, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('load() and strategy', () => {
    it(`adds the properties if SourceStrategy.ADD`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = {
        strategy: SourceStrategy.ADD,
        load: () => of(state1).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`adds preserving the properties if SourceStrategy.ADD_PRESERVING`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = {
        strategy: SourceStrategy.ADD_PRESERVING,
        load: () => of(state1).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.addPreserving).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.addPreserving).toHaveBeenNthCalledWith(1, state1, undefined);

      await clock.runAllAsync();
      expect(service.addPreserving).toHaveBeenCalledTimes(1);
    });

    it(`merges the properties if SourceStrategy.MERGE`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = {
        strategy: SourceStrategy.MERGE,
        load: () => of(state1).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.merge).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.merge).toHaveBeenNthCalledWith(1, state1, undefined);

      await clock.runAllAsync();
      expect(service.merge).toHaveBeenCalledTimes(1);
    });

    it(`merges preserving the properties if SourceStrategy.MERGE_PRESERVING`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = {
        strategy: SourceStrategy.MERGE_PRESERVING,
        load: () => of(state1).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.mergePreserving).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.mergePreserving).toHaveBeenNthCalledWith(1, state1, undefined);

      await clock.runAllAsync();
      expect(service.mergePreserving).toHaveBeenCalledTimes(1);
    });
  });

  describe('load() and path', () => {
    it(`sets the properties using path`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const state2: EnvironmentState = { b: 0 };
      const source1: EnvironmentSource = {
        path: 'a',
        load: () => of(state1).pipe(delay(5))
      };
      const source2: EnvironmentSource = {
        path: 'a',
        strategy: SourceStrategy.MERGE,
        load: () => of(state2).pipe(delay(5))
      };
      loader = new EnvironmentLoader(service, [source1, source2]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(service.add).not.toHaveBeenCalled();
      expect(service.merge).not.toHaveBeenCalled();

      await clock.tickAsync(5); // 5
      expect(service.add).toHaveBeenNthCalledWith(1, state1, 'a');
      expect(service.merge).toHaveBeenNthCalledWith(1, state2, 'a');

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
      expect(service.merge).toHaveBeenCalledTimes(1);
    });
  });

  describe('fallback sources', () => {
    it(`using catch`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = { load: async () => Promise.reject().catch(() => Promise.resolve(state1)) };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });

    it(`using catchError`, async () => {
      const state1: EnvironmentState = { a: 0 };
      const source1: EnvironmentSource = {
        load: () => throwError(() => new Error()).pipe(catchError(() => of(state1)))
      };
      loader = new EnvironmentLoader(service, [source1]);
      loader.load().then(() => load());

      await clock.tickAsync(0); // 0
      expect(load).toHaveBeenCalledTimes(1);
      expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);

      await clock.runAllAsync();
      expect(service.add).toHaveBeenCalledTimes(1);
    });
  });
});
