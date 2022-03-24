import { TestBed } from '@angular/core/testing';
import { EnvironmentState } from '@kuoki/environment';

import { ENVIRONMENT_INITIAL_STATE } from './environment-initial-state.token';

describe('Angular Environment Store Use Cases', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`Provides the initial value from local storage`, () => {
    const localStorageState = { a: 0 };
    jest.spyOn(global.Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(localStorageState));

    function initialStateFromLocalStorage(): EnvironmentState {
      try {
        return JSON.parse(localStorage.getItem('environment') ?? '{}');
      } catch {
        return {};
      }
    }

    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_INITIAL_STATE, useFactory: initialStateFromLocalStorage }]
    });

    expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual(localStorageState);
  });
});
