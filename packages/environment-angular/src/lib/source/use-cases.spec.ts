import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EnvironmentSource, EnvironmentState, isEnvironmentSource } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { ENVIRONMENT_SOURCES_FACTORY } from './environment-sources-factory.token';
import { ENVIRONMENT_SOURCES } from './environment-sources.token';

@Injectable({ providedIn: 'root' })
export class Source1 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

export class Source2 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}

describe('Angular Environment Sources Use Cases', () => {
  describe('use with single source', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: ENVIRONMENT_SOURCES, useClass: Source2 }]
      });
    });

    it(`ENVIRONMENT_SOURCES_FACTORY returns a valid EnvironmentSource object`, () => {
      const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

      expect(sourcesFactory).toBeObject();
      expect(sourcesFactory).toBeInstanceOf(Source2);
      expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
    });
  });

  describe('use with multiple sources', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: ENVIRONMENT_SOURCES, useValue: [Source1, { load: () => [{ a: 0 }] }, new Source2()] }]
      });
    });

    it(`ENVIRONMENT_SOURCES_FACTORY returns an array of valid EnvironmentSource objects`, () => {
      const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

      expect(sourcesFactory).toBeArrayOfSize(3);

      expect(sourcesFactory[0]).toBeObject();
      expect(sourcesFactory[0]).toBeInstanceOf(Source1);
      expect(isEnvironmentSource(sourcesFactory[0])).toBeTrue();

      expect(sourcesFactory[1]).toBeObject();
      expect(isEnvironmentSource(sourcesFactory[1])).toBeTrue();

      expect(sourcesFactory[2]).toBeObject();
      expect(sourcesFactory[2]).toBeInstanceOf(Source2);
      expect(isEnvironmentSource(sourcesFactory[2])).toBeTrue();
    });
  });

  describe('using .forRoot({sources}) with single source', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot({ sources: Source2 })]
      });
    });

    it(`ENVIRONMENT_SOURCES_FACTORY returns a valid EnvironmentSource object`, () => {
      const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

      expect(sourcesFactory).toBeObject();
      expect(sourcesFactory).toBeInstanceOf(Source2);
      expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
    });
  });

  describe('using .forRoot({sources}) with multiple sources', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot({ sources: [Source1, { load: () => [{ a: 0 }] }, new Source2()] })]
      });
    });

    it(`ENVIRONMENT_SOURCES_FACTORY returns an array of valid EnvironmentSource objects`, () => {
      const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

      expect(sourcesFactory).toBeArrayOfSize(3);

      console.log(sourcesFactory[0]);
      expect(sourcesFactory[0]).toBeObject();
      expect(sourcesFactory[0]).toBeInstanceOf(Source1);
      expect(isEnvironmentSource(sourcesFactory[0])).toBeTrue();

      expect(sourcesFactory[1]).toBeObject();
      expect(isEnvironmentSource(sourcesFactory[1])).toBeTrue();

      expect(sourcesFactory[2]).toBeObject();
      expect(sourcesFactory[2]).toBeInstanceOf(Source2);
      expect(isEnvironmentSource(sourcesFactory[2])).toBeTrue();
    });
  });
});
