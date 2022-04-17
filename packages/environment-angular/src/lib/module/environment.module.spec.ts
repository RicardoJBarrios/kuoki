import { Inject, Injectable, Optional } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  EnvironmentLoader,
  EnvironmentQuery,
  EnvironmentQueryConfig,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentState,
  EnvironmentStore,
  isEnvironmentSource
} from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

import { DefaultEnvironmentLoader } from '../loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from '../query';
import { DefaultEnvironmentService } from '../service';
import { ENVIRONMENT_SOURCES, ENVIRONMENT_SOURCES_FACTORY } from '../source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_STATE } from '../store';
import { EnvironmentModule } from './environment.module';

@Injectable()
export class CustomEnvironmentStore extends DefaultEnvironmentStore {
  constructor(
    @Optional()
    @Inject(ENVIRONMENT_INITIAL_STATE)
    protected override readonly _initialState?: EnvironmentState
  ) {
    super(_initialState);
  }
}

@Injectable()
export class CustomEnvironmentService extends DefaultEnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
}

@Injectable()
export class CustomEnvironmentQuery extends DefaultEnvironmentQuery {
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
export class CustomEnvironmentLoader extends DefaultEnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,
    @Optional()
    @Inject(ENVIRONMENT_SOURCES_FACTORY)
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
}

@Injectable({ providedIn: 'root' })
export class RequiredSource extends EnvironmentSource {
  override id = 'RequiredSource';
  override isRequired = true;
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

@Injectable({ providedIn: 'root' })
export class NoRequiredSource extends EnvironmentSource {
  override id = 'NoRequiredSource';
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}

export class NoInjectableSource extends EnvironmentSource {
  override id = 'NoInjectableSource';
  load(): EnvironmentState[] {
    return [{ c: 0 }];
  }
}

describe('EnvironmentModule', () => {
  it('without providers throws because no EnvironmentQuery provided', () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule] });

    expect(() => TestBed.inject(EnvironmentModule)).toThrow(
      'An instance of EnvironmentQuery is required. ' +
        'Use EnvironmentModule.forRoot() or provide the EnvironmentQuery service'
    );
  });

  it(`without providers .query returns undefined`, () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule] });

    expect(EnvironmentModule.query).toBeUndefined();
  });

  it(`with store and query providers doesn't throw`, () => {
    TestBed.configureTestingModule({
      imports: [EnvironmentModule],
      providers: [
        { provide: EnvironmentStore, useClass: DefaultEnvironmentStore },
        { provide: EnvironmentQuery, useClass: DefaultEnvironmentQuery }
      ]
    });

    expect(() => TestBed.inject(EnvironmentModule)).not.toThrow();
  });

  it(`with store and query providers .query exposes the injected EnvironmentQuery `, () => {
    TestBed.configureTestingModule({
      imports: [EnvironmentModule],
      providers: [
        { provide: EnvironmentStore, useClass: DefaultEnvironmentStore },
        { provide: EnvironmentQuery, useClass: DefaultEnvironmentQuery }
      ]
    });

    TestBed.inject(EnvironmentModule);

    expect(EnvironmentModule.query).toBeInstanceOf(DefaultEnvironmentQuery);
  });

  it(`.forRoot() injects all default implementations`, () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule.forRoot()] });

    expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual({});
    expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(DefaultEnvironmentStore);
    expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(DefaultEnvironmentService);
    expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual(null);
    expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(DefaultEnvironmentQuery);
    expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
  });

  it(`.forRoot() sources is null`, () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule.forRoot()] });

    expect(TestBed.inject(ENVIRONMENT_SOURCES)).toBeNull();
    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeNull();
  });

  it(`.forRoot(config) injects all custom injected objects`, () => {
    const initialState = { initialState: 0 };
    const queryConfig = { transpileEnvironment: true };

    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({
          initialState,
          store: CustomEnvironmentStore,
          service: CustomEnvironmentService,
          queryConfig,
          query: CustomEnvironmentQuery,
          loader: CustomEnvironmentLoader
        })
      ]
    });

    expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual(initialState);
    expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(CustomEnvironmentStore);
    expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(CustomEnvironmentService);
    expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual(queryConfig);
    expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(CustomEnvironmentQuery);
    expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
  });

  it(`.forRoot({sources:source}) ENVIRONMENT_SOURCES contains EnvironmentSource injected object`, () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule.forRoot({ sources: RequiredSource })] });
    const sources = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeObject();
    expect(sources).toBeInstanceOf(RequiredSource);
    expect(isEnvironmentSource(sources)).toBeTrue();
  });

  it(`.forRoot({sources:source}) ENVIRONMENT_SOURCES_FACTORY contains EnvironmentSource injected objects array`, () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule.forRoot({ sources: RequiredSource })] });
    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeObject();
    expect(sourcesFactory).toBeInstanceOf(RequiredSource);
    expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
  });

  it(`.forRoot({sources:source[]}) ENVIRONMENT_SOURCES contains EnvironmentSource class or object`, () => {
    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({
          sources: [RequiredSource, { load: () => [{ a: 0 }] }, new NoInjectableSource()]
        })
      ]
    });
    const sources: any = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeArrayOfSize(3);
    expect(sources[0]).toBeFunction();
    expect(sources[1]).toBeObject();
    expect(sources[2]).toBeObject();
  });

  it(`.forRoot({sources:source[]}) ENVIRONMENT_SOURCES_FACTORY contains EnvironmentSource injected objects array`, () => {
    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({
          sources: [RequiredSource, { load: () => [{ a: 0 }] }, new NoInjectableSource()]
        })
      ]
    });
    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeArrayOfSize(3);
    expect(sourcesFactory[0]).toBeObject();
    expect(sourcesFactory[0]).toBeInstanceOf(RequiredSource);
    expect(sourcesFactory[1]).toBeObject();
    expect(sourcesFactory[2]).toBeObject();
    expect(sourcesFactory.every((s) => isEnvironmentSource(s))).toBeTrue();
  });

  it('.forRoot({loadBeforeInit:true}) loads the sources on app initializer', () => {
    TestBed.configureTestingModule({ imports: [EnvironmentModule.forRoot({ sources: RequiredSource })] });
    const store = TestBed.inject(EnvironmentStore);

    expect(store.getAll()).toEqual({ a: 0 });
  });

  it(`.forRoot({loadBeforeInit:false})  doesn't load the sources on app initializer`, () => {
    TestBed.configureTestingModule({
      imports: [EnvironmentModule.forRoot({ sources: RequiredSource, loadBeforeInit: false })]
    });
    const store = TestBed.inject(EnvironmentStore);

    expect(store.getAll()).toEqual({});
  });

  it(`.forRoot(config) and providers providers has preference over .forRoot(config)`, () => {
    const initialState = { initialState: 0 };
    const provInitialState = { provInitialState: 0 };
    const queryConfig = { transpileEnvironment: true };
    const provQueryConfig = { transpileEnvironment: false };

    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({
          initialState,
          store: CustomEnvironmentStore,
          service: CustomEnvironmentService,
          queryConfig,
          query: CustomEnvironmentQuery,
          sources: [RequiredSource, NoRequiredSource],
          loader: CustomEnvironmentLoader
        })
      ],
      providers: [
        { provide: ENVIRONMENT_INITIAL_STATE, useValue: provInitialState },
        { provide: EnvironmentStore, useClass: DefaultEnvironmentStore },
        { provide: EnvironmentService, useClass: DefaultEnvironmentService },
        { provide: ENVIRONMENT_QUERY_CONFIG, useValue: provQueryConfig },
        { provide: EnvironmentQuery, useClass: DefaultEnvironmentQuery },
        { provide: ENVIRONMENT_SOURCES, useClass: NoInjectableSource },
        { provide: EnvironmentLoader, useClass: DefaultEnvironmentLoader }
      ]
    });

    expect(TestBed.inject(ENVIRONMENT_INITIAL_STATE)).toEqual(provInitialState);
    expect(TestBed.inject(EnvironmentStore)).toBeInstanceOf(DefaultEnvironmentStore);
    expect(TestBed.inject(EnvironmentService)).toBeInstanceOf(DefaultEnvironmentService);
    expect(TestBed.inject(ENVIRONMENT_QUERY_CONFIG)).toEqual(provQueryConfig);
    expect(TestBed.inject(EnvironmentQuery)).toBeInstanceOf(DefaultEnvironmentQuery);
    expect(TestBed.inject(ENVIRONMENT_SOURCES)).toBeInstanceOf(NoInjectableSource);
    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeInstanceOf(NoInjectableSource);
    expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
  });

  it(`.forChild() injects loader default implementation for this module`, () => {
    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({ loader: CustomEnvironmentLoader, sources: RequiredSource }),
        EnvironmentModule.forChild()
      ]
    });

    expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(DefaultEnvironmentLoader);
  });

  it(`.forChild() sources is null for this module`, () => {
    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({ loader: CustomEnvironmentLoader, sources: RequiredSource }),
        EnvironmentModule.forChild()
      ]
    });

    expect(TestBed.inject(ENVIRONMENT_SOURCES)).toBeNull();
    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeNull();
  });

  it(`.forChild(config) injects customn loader implementation for this module`, () => {
    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({ sources: RequiredSource }),
        EnvironmentModule.forChild({ loader: CustomEnvironmentLoader, sources: NoRequiredSource })
      ]
    });

    expect(TestBed.inject(EnvironmentLoader)).toBeInstanceOf(CustomEnvironmentLoader);
  });

  it(`.forChild(config) sources are defined for this module`, () => {
    TestBed.configureTestingModule({
      imports: [
        EnvironmentModule.forRoot({ sources: RequiredSource }),
        EnvironmentModule.forChild({ loader: CustomEnvironmentLoader, sources: NoRequiredSource })
      ]
    });
    const sources = TestBed.inject(ENVIRONMENT_SOURCES);
    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sources).toBeObject();
    expect(sources).toBeInstanceOf(NoRequiredSource);
    expect(isEnvironmentSource(sources)).toBeTrue();

    expect(sourcesFactory).toBeObject();
    expect(sourcesFactory).toBeInstanceOf(NoRequiredSource);
    expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
  });
});
