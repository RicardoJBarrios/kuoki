import { validate } from 'uuid';

import { EnvironmentSource, SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';
import { loaderSourcesFactory } from './loader-sources-factory.function';

describe('loaderSourcesFactory(sources?)', () => {
  it(`() returns empty array`, () => {
    expect(loaderSourcesFactory()).toEqual([]);
    expect(loaderSourcesFactory(undefined)).toEqual([]);
  });

  it(`(source) returns an array with one loader source`, () => {
    const source1: EnvironmentSource = { load: () => [{}] };
    const sources: LoaderSource[] = loaderSourcesFactory(source1);

    expect(sources).toBeArrayOfSize(1);
  });

  it(`(source[]) returns an array with multiple loader sources`, () => {
    const source1: EnvironmentSource = { load: () => [{}] };
    const source2: EnvironmentSource = { load: () => [{}] };
    const sources: LoaderSource[] = loaderSourcesFactory([source1, source2]);

    expect(sources).toBeArrayOfSize(2);
  });

  it(`returns with all defaults`, () => {
    const source1: EnvironmentSource = { load: () => [{}] };
    const sources: LoaderSource[] = loaderSourcesFactory(source1);
    const source: LoaderSource = sources[0];

    expect(validate(source.id)).toBeTrue();
    expect(source.isRequired).toBeFalse();
    expect(source.isOrdered).toBeFalse();
    expect(source.ignoreError).toBeFalse();
    expect(source.strategy).toEqual(SourceStrategy.ADD);
    expect(source.path).toBeUndefined();
    expect(source.load).toEqual(source1.load);
  });

  it(`returns with all custom`, () => {
    const id = 'a';
    const isRequired = true;
    const isOrdered = true;
    const ignoreError = true;
    const strategy = SourceStrategy.MERGE;
    const path = 'a';
    const source1: EnvironmentSource = { id, isRequired, isOrdered, ignoreError, strategy, path, load: () => [{}] };
    const sources: LoaderSource[] = loaderSourcesFactory(source1);
    const source: LoaderSource = sources[0];

    expect(source.id).toEqual(id);
    expect(source.isRequired).toEqual(isRequired);
    expect(source.isOrdered).toEqual(isOrdered);
    expect(source.ignoreError).toEqual(ignoreError);
    expect(source.strategy).toEqual(strategy);
    expect(source.path).toEqual(path);
    expect(source.load).toEqual(source1.load);
  });
});
