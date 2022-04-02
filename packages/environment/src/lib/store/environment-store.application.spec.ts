import { marbles } from 'rxjs-marbles/jest';
import { TestObservableLike } from 'rxjs-marbles/types';

import { DefaultEnvironmentStore } from './environment-store.application';

const aValue = { a: 0 };
const bValue = { b: 0 };

describe('DefaultEnvironmentStore', () => {
  let store: DefaultEnvironmentStore;

  describe('with default initial value', () => {
    const initialState = {};

    beforeEach(() => {
      store = new DefaultEnvironmentStore();
    });

    it(`is created with default initial state`, () => {
      expect(store['initialState']).toEqual(initialState);
    });

    it(
      `getAll$() returns all the environment properties as Observable`,
      marbles((m) => {
        const source: TestObservableLike<any> = m.cold('-a-b-a-|', { a: aValue, b: bValue });
        const expected: TestObservableLike<any> = m.cold('-a-b-a-|', { a: aValue, b: bValue });
        jest.spyOn((store as any).state, 'asObservable').mockReturnValue(source);

        m.expect(store.getAll$()).toBeObservable(expected);
      })
    );

    it(`getAll() returns the environment properties`, () => {
      expect(store.getAll()).toEqual(initialState);
    });

    it(`update() mutates the environment`, () => {
      expect(store.getAll()).toEqual(initialState);
      store.update(aValue);
      expect(store.getAll()).toEqual(aValue);
      store.update(bValue);
      expect(store.getAll()).toEqual(bValue);
    });

    it(`reset() resets the environment to the initial value`, () => {
      store.update(bValue);
      expect(store.getAll()).toEqual(bValue);
      store.reset();
      expect(store.getAll()).toEqual(initialState);
    });
  });

  describe('with custom initial value', () => {
    const initialState = aValue;

    beforeEach(() => {
      store = new DefaultEnvironmentStore(initialState);
    });

    it(`is created with custom initial state`, () => {
      expect(store['initialState']).toEqual(initialState);
    });

    it(`reset() resets the environment to the initial value`, () => {
      store.update(bValue);
      expect(store.getAll()).toEqual(bValue);
      store.reset();
      expect(store.getAll()).toEqual(initialState);
    });
  });
});
