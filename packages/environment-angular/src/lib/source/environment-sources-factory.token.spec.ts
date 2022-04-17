import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';

import { ENVIRONMENT_SOURCES_FACTORY } from './environment-sources-factory.token';
import { ENVIRONMENT_SOURCES } from './environment-sources.token';

@Injectable({ providedIn: 'root' })
export class SourceInj extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

export class SourceNoInj extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}

const sourceObj = { load: () => [{ a: 0 }] };

describe('ENVIRONMENT_SOURCES_FACTORY', () => {
  it(`returns null if no ENVIRONMENT_SOURCES`, () => {
    TestBed.configureTestingModule({});

    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeNull();
  });

  it(`returns null if ENVIRONMENT_SOURCES is null`, () => {
    TestBed.configureTestingModule({ providers: [{ provide: ENVIRONMENT_SOURCES, useValue: null }] });

    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeNull();
  });

  it(`returns null if ENVIRONMENT_SOURCES is array of null`, () => {
    TestBed.configureTestingModule({ providers: [{ provide: ENVIRONMENT_SOURCES, useValue: [null] }] });

    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeNull();
  });

  it(`returns object instance if ENVIRONMENT_SOURCES is injectable class`, () => {
    TestBed.configureTestingModule({ providers: [{ provide: ENVIRONMENT_SOURCES, useClass: SourceInj }] });

    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeInstanceOf(SourceInj);
  });

  it(`returns object instance if ENVIRONMENT_SOURCES is plain object`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useValue: sourceObj }]
    });

    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeObject();
  });

  it(`returns object instance if ENVIRONMENT_SOURCES is object instance`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useValue: new SourceNoInj() }]
    });

    expect(TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toBeInstanceOf(SourceNoInj);
  });

  it(`returns array of object instances if ENVIRONMENT_SOURCES is array of injectable classes or objects`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useValue: [SourceInj, sourceObj, new SourceNoInj()] }]
    });

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeArrayOfSize(3);
    expect(sourcesFactory[0]).toBeInstanceOf(SourceInj);
    expect(sourcesFactory[1]).toBeObject();
    expect(sourcesFactory[2]).toBeInstanceOf(SourceNoInj);
  });

  it(`returns array of object instances if ENVIRONMENT_SOURCES filtering null objects`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useValue: [SourceInj, null, new SourceNoInj()] }]
    });

    const sourcesFactory = TestBed.inject(ENVIRONMENT_SOURCES_FACTORY);

    expect(sourcesFactory).toBeArrayOfSize(2);
    expect(sourcesFactory[0]).toBeInstanceOf(SourceInj);
    expect(sourcesFactory[1]).toBeInstanceOf(SourceNoInj);
  });

  it(`throws if the class is not injectable`, () => {
    TestBed.configureTestingModule({
      providers: [{ provide: ENVIRONMENT_SOURCES, useValue: [SourceNoInj] }]
    });

    expect(() => TestBed.inject(ENVIRONMENT_SOURCES_FACTORY)).toThrow();
  });
});
