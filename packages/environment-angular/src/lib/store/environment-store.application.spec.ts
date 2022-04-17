import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { ENVIRONMENT_INITIAL_STATE } from './environment-initial-state.token';
import { DefaultEnvironmentStore } from './environment-store.application';

describe('DefaultEnvironmentStore', () => {
  let spectator: SpectatorService<DefaultEnvironmentStore>;

  describe('with default ENVIRONMENT_INITIAL_STATE', () => {
    const createService = createServiceFactory(DefaultEnvironmentStore);

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with default initial value`, () => {
      expect(spectator.service['initialState']).toEqual({});
    });
  });

  describe('with custom ENVIRONMENT_INITIAL_STATE', () => {
    const initialState = { a: 0 };
    const createService = createServiceFactory({
      service: DefaultEnvironmentStore,
      providers: [{ provide: ENVIRONMENT_INITIAL_STATE, useValue: initialState }]
    });

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with custom initial value`, () => {
      expect(spectator.service['initialState']).toEqual(initialState);
    });
  });
});
