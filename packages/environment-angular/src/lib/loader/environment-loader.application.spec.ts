import { EnvironmentService } from '@kuoki/environment';
import { createServiceFactory, createSpyObject, SpectatorService } from '@ngneat/spectator/jest';

import { DefaultEnvironmentService } from '../service';
import { ENVIRONMENT_SOURCES } from '../source';
import { DefaultEnvironmentLoader } from './environment-loader.application';

describe('DefaultEnvironmentLoader', () => {
  let spectator: SpectatorService<DefaultEnvironmentLoader>;

  describe('with default ENVIRONMENT_SOURCES', () => {
    const createService = createServiceFactory({
      service: DefaultEnvironmentLoader,
      providers: [{ provide: EnvironmentService, useValue: createSpyObject(DefaultEnvironmentService) }]
    });

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with default sources`, () => {
      expect(spectator.service['sources']).toBeNull();
    });
  });

  describe('with custom ENVIRONMENT_SOURCES', () => {
    const initialSource = { load: () => [{ a: 0 }] };
    const createService = createServiceFactory({
      service: DefaultEnvironmentLoader,
      providers: [
        { provide: EnvironmentService, useValue: createSpyObject(DefaultEnvironmentService) },
        { provide: ENVIRONMENT_SOURCES, useValue: initialSource }
      ]
    });

    beforeEach(() => {
      spectator = createService();
    });

    it(`is created with custom sources`, () => {
      expect(spectator.service['sources']).toEqual(initialSource);
    });
  });
});
