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

import { EnvironmentAngularModule } from './environment-angular.module';
import { DefaultEnvironmentLoader } from './loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from './query';
import { DefaultEnvironmentService, ENVIRONMENT_SERVICE } from './service';
import { ENVIRONMENT_SOURCES } from './source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_VALUE, ENVIRONMENT_STORE } from './store';

@Injectable()
export class CustomEnvironmentStore implements EnvironmentStore {
  constructor() {}
  getAll$(): Observable<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
  getAll(): EnvironmentState {
    throw new Error('Method not implemented.');
  }
  update(environment: EnvironmentState): void {
    throw new Error('Method not implemented.');
  }
  reset(): void {
    throw new Error('Method not implemented.');
  }
}

@Injectable()
export class CustomEnvironmentService extends EnvironmentService {
  constructor(@Inject(ENVIRONMENT_STORE) protected override readonly store: EnvironmentStore) {
    super(store);
  }
}

@Injectable()
export class CustomEnvironmentQuery extends EnvironmentQuery {
  constructor(
    @Inject(ENVIRONMENT_STORE)
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
    @Inject(ENVIRONMENT_SERVICE)
    protected override readonly service: EnvironmentService,

    @Optional()
    @Inject(ENVIRONMENT_SOURCES)
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
}

describe('EnvironmentAngularModule', () => {
  describe('forRoot()', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentAngularModule.forRoot()]
      });
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
  });

  describe('forRoot({initialValue,store,service,queryConfig,query,sources,loader})', () => {
    const initialValue = { a: 0 };
    const sources = [{ load: () => [{ b: 0 }] }];
    const queryConfig = { transpileEnvironment: true };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          EnvironmentAngularModule.forRoot({
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
  });

  describe('forRoot({sources})', () => {
    const sources = [{ load: () => [{ b: 0 }] }];

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [EnvironmentAngularModule.forRoot({ sources })]
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
        imports: [EnvironmentAngularModule.forRoot({ sources, loadBeforeInit: true })]
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
        imports: [EnvironmentAngularModule.forRoot({ sources, loadBeforeInit: false })]
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
        imports: [EnvironmentAngularModule.forRoot(), EnvironmentAngularModule.forChild()]
      });
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
        imports: [
          EnvironmentAngularModule.forRoot(),
          EnvironmentAngularModule.forChild({ loader: CustomEnvironmentLoader, sources })
        ]
      });
    });

    it('provides custom ENVIRONMENT_SOURCES', () => {
      expect(TestBed.inject(ENVIRONMENT_SOURCES)).toEqual(sources);
    });

    it('provides custom EnvironmentLoader', () => {
      expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
    });
  });
});
