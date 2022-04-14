import { TestBed } from '@angular/core/testing';
import { EnvironmentLoader, EnvironmentQuery, EnvironmentService, EnvironmentStore } from '@kuoki/environment';

import { DefaultEnvironmentLoader } from '../loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from '../query';
import { DefaultEnvironmentService } from '../service';
import { ENVIRONMENT_SOURCES } from '../source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_STATE } from '../store';
import { EnvironmentModule } from './environment.module';
import {
  CustomEnvironmentLoader,
  CustomEnvironmentQuery,
  CustomEnvironmentService,
  CustomEnvironmentStore,
  RequiredSource
} from './use-cases.spec';

describe('EnvironmentModule', () => {
  describe('without providers', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule]
      });
    });

    it('throws because no EnvironmentQuery provided', () => {
      expect(() => TestBed.inject(EnvironmentModule)).toThrow(
        'An instance of EnvironmentQuery is required. ' +
          'Use EnvironmentModule.forRoot() or provide the EnvironmentQuery service'
      );
    });
  });

  describe('with store and query providers', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule],
        providers: [
          { provide: EnvironmentStore, useClass: EnvironmentStore },
          { provide: EnvironmentQuery, useClass: EnvironmentQuery }
        ]
      });
    });

    it(`doesn't throw`, () => {
      expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
    });
  });

  // describe('forRoot({sources})', () => {
  //   const sources = [{ load: () => [{ b: 0 }] }];
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot({ sources })]
  //     });
  //   });
  //   it('loads the sources on app initializer', () => {
  //     const store = TestBed.inject(EnvironmentStore);
  //     expect(store.getAll()).toEqual({ b: 0 });
  //   });
  // });
  // describe('forRoot({sources,loadBeforeInit:true})', () => {
  //   const sources = [{ load: () => [{ b: 0 }] }];
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot({ sources, loadBeforeInit: true })]
  //     });
  //   });
  //   it('loads the sources on app initializer', () => {
  //     const store = TestBed.inject(EnvironmentStore);
  //     expect(store.getAll()).toEqual({ b: 0 });
  //   });
  // });
  // describe('forRoot({sources,loadBeforeInit:false})', () => {
  //   const sources = [{ load: () => [{ b: 0 }] }];
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot({ sources, loadBeforeInit: false })]
  //     });
  //   });
  //   it(`doesn't load the sources on app initializer`, () => {
  //     const store = TestBed.inject(EnvironmentStore);
  //     expect(store.getAll()).toEqual({});
  //   });
  // });

  // describe('forChild()', () => {
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot(), EnvironmentModule.forChild()]
  //     });
  //   });
  //   it(`Injects the module`, () => {
  //     expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
  //   });
  //   it('provides custom ENVIRONMENT_SOURCES', () => {
  //     expect(TestBed.inject(ENVIRONMENT_SOURCES)).toBeNull();
  //   });
  //   it('provides DefaultEnvironmentLoader', () => {
  //     expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
  //   });
  // });
  // describe('forChild({loader,sources})', () => {
  //   const sources = [{ id: 'a', load: () => [{ a: 0 }] }];
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot(), EnvironmentModule.forChild({ loader: CustomEnvironmentLoader, sources })]
  //     });
  //   });
  //   it('provides custom ENVIRONMENT_SOURCES', () => {
  //     const sources = TestBed.inject(ENVIRONMENT_SOURCES);
  //     expect(sources).toBeArrayOfSize(1);
  //   });
  //   it('provides custom EnvironmentLoader', () => {
  //     expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
  //   });
  // });
  // describe('using custom providers', () => {
  //   const sources = [{ load: () => [{ b: 0 }] }];
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule],
  //       providers: [
  //         { provide: ENVIRONMENT_INITIAL_STATE, useValue: {} },
  //         { provide: EnvironmentStore, useClass: CustomEnvironmentStore },
  //         { provide: EnvironmentService, useClass: CustomEnvironmentService },
  //         { provide: ENVIRONMENT_QUERY_CONFIG, useValue: {} },
  //         { provide: EnvironmentQuery, useClass: CustomEnvironmentQuery },
  //         { provide: ENVIRONMENT_SOURCES, useValue: sources },
  //         { provide: EnvironmentLoader, useClass: CustomEnvironmentLoader }
  //       ]
  //     });
  //   });
  //   it(`Injects the module`, () => {
  //     expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
  //   });
  //   it('uses provided services', () => {
  //     expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual({});
  //     expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
  //     expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(CustomEnvironmentService);
  //     expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual({});
  //     expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(CustomEnvironmentQuery);
  //     expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual(sources);
  //     expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
  //     expect(EnvironmentModule.query).toBeInstanceOf(CustomEnvironmentQuery);
  //   });
  // });
  // describe('mixing forRoot() and custom providers', () => {
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot()],
  //       providers: [{ provide: EnvironmentStore, useClass: CustomEnvironmentStore }]
  //     });
  //   });
  //   it(`Injects the module`, () => {
  //     expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
  //   });
  //   it('uses provided services', () => {
  //     expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual({});
  //     expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
  //     expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(DefaultEnvironmentService);
  //     expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual({});
  //     expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(DefaultEnvironmentQuery);
  //     expect(TestBed.inject(ENVIRONMENT_SOURCES)).toBeNull();
  //     expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
  //     expect(EnvironmentModule.query).toBeInstanceOf(DefaultEnvironmentQuery);
  //   });
  // });
  // describe('use of injectable sources in forRoot()', () => {
  //   beforeEach(() => {
  //     TestBed.configureTestingModule({
  //       imports: [EnvironmentModule.forRoot({ sources: [SimpleSource] })]
  //     });
  //   });
  //   it(`the module in injected`, () => {
  //     const sources: any = TestBed.inject(ENVIRONMENT_SOURCES);
  //     expect(sources).toBeArrayOfSize(1);
  //     expect(sources[0]).toBeObject();
  //   });
  // });
});

describe('EnvironmentModule.forRoot(config?)', () => {
  describe('forRoot() ', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentModule.forRoot()]
      });
    });

    it(`injects all default implementations`, () => {
      expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual({});
      expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(DefaultEnvironmentStore);
      expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(DefaultEnvironmentService);
      expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual({});
      expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(DefaultEnvironmentQuery);
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toBeNull();
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
    });
  });

  describe('forRoot(config) ', () => {
    const initialState = { initialState: 0 };
    const queryConfig = { transpileEnvironment: true };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          EnvironmentModule.forRoot({
            initialState,
            store: CustomEnvironmentStore,
            service: CustomEnvironmentService,
            queryConfig,
            query: CustomEnvironmentQuery,
            sources: [RequiredSource],
            loader: CustomEnvironmentLoader
          })
        ]
      });
    });

    it(`injects all custom objects`, () => {
      expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual(initialState);
      expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
      expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(CustomEnvironmentService);
      expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual(queryConfig);
      expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(CustomEnvironmentQuery);
      const sources: any = TestBed.inject(ENVIRONMENT_SOURCES);
      expect(sources).toBeArrayOfSize(1);
      expect(sources[0]).toBeObject();
      expect(sources[0]).toBeInstanceOf(RequiredSource);
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
    });
  });
});
