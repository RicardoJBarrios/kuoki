import { EnvironmentStore } from '@kuoki/environment';
import { createServiceFactory, createSpyObject, SpectatorService } from '@ngneat/spectator/jest';

import { ENVIRONMENT_QUERY_CONFIG } from './environment-query-config.token';
import { DefaultEnvironmentQuery } from './environment-query.application';

describe('DefaultEnvironmentQuery', () => {
  let spectator: SpectatorService<DefaultEnvironmentQuery>;

  describe('with default ENVIRONMENT_QUERY_CONFIG', () => {
    const createService = createServiceFactory({
      service: DefaultEnvironmentQuery,
      providers: [{ provide: EnvironmentStore, useValue: createSpyObject(DefaultEnvironmentQuery) }]
    });

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with default query config`, () => {
      expect(spectator.service['queryConfig']).toBeNull();
    });
  });

  describe('with custom ENVIRONMENT_QUERY_CONFIG', () => {
    const initialState = { transpileEnvironment: true };
    const createService = createServiceFactory({
      service: DefaultEnvironmentQuery,
      providers: [
        { provide: EnvironmentStore, useValue: createSpyObject(DefaultEnvironmentQuery) },
        { provide: ENVIRONMENT_QUERY_CONFIG, useValue: initialState }
      ]
    });

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with custom query config`, () => {
      expect(spectator.service['queryConfig']).toEqual(initialState);
    });
  });
});
