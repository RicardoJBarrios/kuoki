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

const sourceObj = { load: () => [{ a: 0 }] };

describe('Angular Environment Sources Use Cases', () => {
  it(`use with single source`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useClass: Source2 }]
    });

    const sources = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sources)).toBeTrue();

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
  });

  it(`use with multiple sources`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useValue: [Source1, sourceObj, new Source2()] }]
    });

    const sources: any = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeArrayOfSize(3);
    expect(sources[0]).toBeFunction();
    expect(isEnvironmentSource(sources[0])).toBeFalse();
    expect(sources[1]).toBeObject();
    expect(isEnvironmentSource(sources[1])).toBeTrue();
    expect(sources[2]).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sources[2])).toBeTrue();

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeArrayOfSize(3);
    expect(sourcesFactory[0]).toBeInstanceOf(Source1);
    expect(isEnvironmentSource(sourcesFactory[0])).toBeTrue();
    expect(sourcesFactory[1]).toBeObject();
    expect(isEnvironmentSource(sourcesFactory[1])).toBeTrue();
    expect(sourcesFactory[2]).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sourcesFactory[2])).toBeTrue();
  });

  it(`.forRoot({sources}) with single source`, () => {
    TestBed.configureTestingModule({
      imports: [EnvironmentModule.forRoot({ sources: Source1 })]
    });

    const sources = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeInstanceOf(Source1);
    expect(isEnvironmentSource(sources)).toBeTrue();

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeObject();
    expect(sourcesFactory).toBeInstanceOf(Source1);
    expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
  });

  it(`.forRoot({sources}) with multiple sources`, () => {
    TestBed.configureTestingModule({
      imports: [EnvironmentModule.forRoot({ sources: [Source1, sourceObj, new Source2()] })]
    });

    const sources: any = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeArrayOfSize(3);
    expect(sources[0]).toBeFunction();
    expect(isEnvironmentSource(sources[0])).toBeFalse();
    expect(sources[1]).toBeObject();
    expect(isEnvironmentSource(sources[1])).toBeTrue();
    expect(sources[2]).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sources[2])).toBeTrue();

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeArrayOfSize(3);
    expect(sourcesFactory[0]).toBeInstanceOf(Source1);
    expect(isEnvironmentSource(sourcesFactory[0])).toBeTrue();
    expect(sourcesFactory[1]).toBeObject();
    expect(isEnvironmentSource(sourcesFactory[1])).toBeTrue();
    expect(sourcesFactory[2]).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sourcesFactory[2])).toBeTrue();
  });

  it(`.forChild({sources}) sets new sources`, () => {
    TestBed.configureTestingModule({
      imports: [EnvironmentModule.forRoot({ sources: Source1 }), EnvironmentModule.forChild({ sources: new Source2() })]
    });

    const sources = TestBed.inject(ENVIRONMENT_SOURCES);

    expect(sources).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sources)).toBeTrue();

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeObject();
    expect(sourcesFactory).toBeInstanceOf(Source2);
    expect(isEnvironmentSource(sourcesFactory)).toBeTrue();
  });
});
