import { Inject, Injectable, Optional } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  EnvironmentLoader,
  EnvironmentQuery,
  EnvironmentQueryConfig,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentState,
  EnvironmentStore
} from '@kuoki/environment';
import { Observable } from 'rxjs';
import { ArrayOrSingle } from 'ts-essentials';

import { DefaultEnvironmentLoader } from '../loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from '../query';
import { DefaultEnvironmentService } from '../service';
import { ENVIRONMENT_SOURCES } from '../source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_VALUE } from '../store';
import { EnvironmentModule } from './environment.module';

@Injectable()
export class CustomEnvironmentStore implements EnvironmentStore {
  getAll$(): Observable<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
  getAll(): EnvironmentState {
    throw new Error('Method not implemented.');
  }
  update(environment: EnvironmentState): void {}
  reset(): void {}
}

@Injectable()
export class CustomEnvironmentService extends EnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
}

@Injectable()
export class CustomEnvironmentQuery extends EnvironmentQuery {
  constructor(
    protected override readonly store: EnvironmentStore,
    @Optional()
    @Inject(ENVIRONMENT_QUERY_CONFIG)
    protected override readonly queryConfig?: EnvironmentQueryConfig | null
  ) {
    super(store, queryConfig);
  }
}

@Injectable()
export class CustomEnvironmentLoader extends EnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,
    @Optional()
    @Inject(ENVIRONMENT_SOURCES)
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
}

const errorMessage = `An instance of EnvironmentQuery is required. Use EnvironmentModule.forRoot() or provide the EnvironmentQuery service`;

describe('EnvironmentModule', () => {
  describe('', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule]
      });
    });

    it('throws if no EnvironmentModule provided', () => {
      expect(() => TestBed.inject(EnvironmentModule)).toThrow(errorMessage);
    });
  });

  describe('forRoot()', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot()]
      });
    });

    it(`Injects the module`, () => {
      expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
    });

    it('provides ENVIRONMENT_INITIAL_VALUE as {}', () => {
      expect(TestBed.inject(ENVIRONMENT_INITIAL_VALUE)).toEqual({});
    });

    it('provides DefaultEnvironmentStore', () => {
      expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(DefaultEnvironmentStore);
    });

    it('provides DefaultEnvironmentService', () => {
      expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(DefaultEnvironmentService);
    });

    it('provides ENVIRONMENT_QUERY_CONFIG as {}', () => {
      expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual({});
    });

    it('provides DefaultEnvironmentQuery', () => {
      expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(DefaultEnvironmentQuery);
    });

    it('provides ENVIRONMENT_SOURCES as []', () => {
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual([]);
    });

    it('provides DefaultEnvironmentLoader', () => {
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
    });

    it('sets EnvironmentModule.query', () => {
      expect(EnvironmentModule.query).toBeInstanceOf(DefaultEnvironmentQuery);
    });
  });

  describe('forRoot({initialValue,store,service,queryConfig,query,sources,loader})', () => {
    const initialValue = { a: 0 };
    const sources = [{ load: () => [{ b: 0 }] }];
    const queryConfig = { transpileEnvironment: true };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          EnvironmentModule.forRoot({
            initialValue,
            store: CustomEnvironmentStore,
            service: CustomEnvironmentService,
            queryConfig,
            query: CustomEnvironmentQuery,
            sources,
            loader: CustomEnvironmentLoader
          })
        ]
      });
    });

    it('provides custom ENVIRONMENT_INITIAL_VALUE', () => {
      expect(TestBed.inject(ENVIRONMENT_INITIAL_VALUE)).toEqual(initialValue);
    });

    it('provides custom EnvironmentStore', () => {
      expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
    });

    it('provides custom EnvironmentService', () => {
      expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(CustomEnvironmentService);
    });

    it('provides custom ENVIRONMENT_QUERY_CONFIG', () => {
      expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual(queryConfig);
    });

    it('provides custom EnvironmentQuery', () => {
      expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(CustomEnvironmentQuery);
    });

    it('provides custom ENVIRONMENT_SOURCES', () => {
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual(sources);
    });

    it('provides custom EnvironmentLoader', () => {
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
    });

    it('sets EnvironmentModule.query', () => {
      expect(EnvironmentModule.query).toBeInstanceOf(CustomEnvironmentQuery);
    });
  });

  describe('forRoot({sources})', () => {
    const sources = [{ load: () => [{ b: 0 }] }];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot({ sources })]
      });
    });

    it('loads the sources on app initializer', () => {
      const store = TestBed.inject(EnvironmentStore);
      expect(store.getAll()).toEqual({ b: 0 });
    });
  });

  describe('forRoot({sources,loadBeforeInit:true})', () => {
    const sources = [{ load: () => [{ b: 0 }] }];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot({ sources, loadBeforeInit: true })]
      });
    });

    it('loads the sources on app initializer', () => {
      const store = TestBed.inject(EnvironmentStore);
      expect(store.getAll()).toEqual({ b: 0 });
    });
  });

  describe('forRoot({sources,loadBeforeInit:false})', () => {
    const sources = [{ load: () => [{ b: 0 }] }];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot({ sources, loadBeforeInit: false })]
      });
    });

    it(`doesn't load the sources on app initializer`, () => {
      const store = TestBed.inject(EnvironmentStore);
      expect(store.getAll()).toEqual({});
    });
  });

  describe('forChild()', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot(), EnvironmentModule.forChild()]
      });
    });

    it(`Injects the module`, () => {
      expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
    });

    it('provides custom ENVIRONMENT_SOURCES', () => {
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual([]);
    });

    it('provides DefaultEnvironmentLoader', () => {
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
    });
  });

  describe('forChild({loader,sources})', () => {
    const sources = [{ id: 'a', load: () => [{ a: 0 }] }];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot(), EnvironmentModule.forChild({ loader: CustomEnvironmentLoader, sources })]
      });
    });

    it('provides custom ENVIRONMENT_SOURCES', () => {
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual(sources);
    });

    it('provides custom EnvironmentLoader', () => {
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
    });
  });

  describe('using custom providers', () => {
    const sources = [{ load: () => [{ b: 0 }] }];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule],
        providers: [
          { provide: ENVIRONMENT_INITIAL_VALUE, useValue: {} },
          { provide: EnvironmentStore, useClass: CustomEnvironmentStore },
          { provide: EnvironmentService, useClass: CustomEnvironmentService },
          { provide: ENVIRONMENT_QUERY_CONFIG, useValue: {} },
          { provide: EnvironmentQuery, useClass: CustomEnvironmentQuery },
          { provide: ENVIRONMENT_SOURCES, useValue: sources },
          { provide: EnvironmentLoader, useClass: CustomEnvironmentLoader }
        ]
      });
    });

    it(`Injects the module`, () => {
      expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
    });

    it('uses provided services', () => {
      expect(TestBed.inject(ENVIRONMENT_INITIAL_VALUE)).toEqual({});
      expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
      expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(CustomEnvironmentService);
      expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual({});
      expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(CustomEnvironmentQuery);
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual(sources);
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
      expect(EnvironmentModule.query).toBeInstanceOf(CustomEnvironmentQuery);
    });
  });

  describe('mixing forRoot() and custom providers', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot()],
        providers: [{ provide: EnvironmentStore, useClass: CustomEnvironmentStore }]
      });
    });

    it(`Injects the module`, () => {
      expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
    });

    it('uses provided services', () => {
      expect(TestBed.inject(ENVIRONMENT_INITIAL_VALUE)).toEqual({});
      expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
      expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(DefaultEnvironmentService);
      expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual({});
      expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(DefaultEnvironmentQuery);
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual([]);
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
      expect(EnvironmentModule.query).toBeInstanceOf(DefaultEnvironmentQuery);
    });
  });
});
