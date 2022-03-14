import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { marbles } from 'rxjs-marbles/jest';
import { TestObservableLike } from 'rxjs-marbles/types';

import { ENVIRONMENT_INITIAL_VALUE } from './environment-initial-value.token';
import { DefaultEnvironmentStore } from './environment-store.application';

const aValue = { a: 0 };
const bValue = { b: 0 };

describe('DefaultEnvironmentStore', () => {
  let spectator: SpectatorService<DefaultEnvironmentStore>;

  describe('with default initial value', () => {
    const initialValue = {};
    const createService = createServiceFactory(DefaultEnvironmentStore);

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with default initial value`, () => {
      expect(spectator.service['calculatedInitialState']).toEqual(initialValue);
    });

    it(
      `getAll$() returns all the environment properties as Observable`,
      marbles((m) => {
        const source: TestObservableLike<any> = m.cold('-a-b-a-|', { a: aValue, b: bValue });
        const expected: TestObservableLike<any> = m.cold('-a-b-a-|', { a: aValue, b: bValue });
        jest.spyOn((spectator.service as any).state, 'asObservable').mockReturnValue(source);

        m.expect(spectator.service.getAll$()).toBeObservable(expected);
      })
    );

    it(`getAll() returns the environment properties`, () => {
      expect(spectator.service.getAll()).toEqual(initialValue);
    });

    it(`update() mutates the environment`, () => {
      expect(spectator.service.getAll()).toEqual(initialValue);
      spectator.service.update(aValue);
      expect(spectator.service.getAll()).toEqual(aValue);
      spectator.service.update(bValue);
      expect(spectator.service.getAll()).toEqual(bValue);
    });

    it(`reset() resets the environment to the initial value`, () => {
      spectator.service.update(bValue);
      expect(spectator.service.getAll()).toEqual(bValue);
      spectator.service.reset();
      expect(spectator.service.getAll()).toEqual(initialValue);
    });
  });

  describe('with custom initial value', () => {
    const initialValue = aValue;
    const createService = createServiceFactory({
      service: DefaultEnvironmentStore,
      providers: [{ provide: ENVIRONMENT_INITIAL_VALUE, useValue: initialValue }]
    });

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with custom initial value`, () => {
      expect(spectator.service['calculatedInitialState']).toEqual(initialValue);
    });

    it(`reset() resets the environment to the initial value`, () => {
      spectator.service.update(bValue);
      expect(spectator.service.getAll()).toEqual(bValue);
      spectator.service.reset();
      expect(spectator.service.getAll()).toEqual(initialValue);
    });
  });
});
