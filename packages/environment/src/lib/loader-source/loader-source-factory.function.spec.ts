import { EnvironmentSource, InvalidSourceError, SourceStrategy } from '../source';
import { loaderSourceFactory } from './loader-source-factory.function';
import { LoaderSource } from './loader-source.type';

describe('loaderSourceFactory(source)', () => {
  it(`(source) returns with all defaults`, () => {
    const source1: EnvironmentSource = { load: () => [{}] };
    const source: LoaderSource = loaderSourceFactory(source1);

    expect(source.id).toBeString();
    expect(source.isRequired).toBeFalse();
    expect(source.isOrdered).toBeFalse();
    expect(source.ignoreError).toBeFalse();
    expect(source.strategy).toEqual(SourceStrategy.ADD);
    expect(source.path).toBeUndefined();
    expect(source.load).toEqual(source1.load);
    expect(source.mapFn).toBeUndefined();
    expect(source.errorHandler).toBeUndefined();
  });

  it(`(source) returns with all custom`, () => {
    const id = 'a';
    const isRequired = true;
    const isOrdered = true;
    const ignoreError = true;
    const strategy = SourceStrategy.MERGE;
    const path = 'a';
    const mapFn = () => ({});
    const errorHandler = () => ({});
    const source1: EnvironmentSource = {
      id,
      isRequired,
      isOrdered,
      ignoreError,
      strategy,
      path,
      load: () => [{}],
      mapFn,
      errorHandler
    };
    const source: LoaderSource = loaderSourceFactory(source1);

    expect(source.id).toEqual(id);
    expect(source.isRequired).toEqual(isRequired);
    expect(source.isOrdered).toEqual(isOrdered);
    expect(source.ignoreError).toEqual(ignoreError);
    expect(source.strategy).toEqual(strategy);
    expect(source.path).toEqual(path);
    expect(source.load).toEqual(source1.load);
    expect(source.mapFn).toEqual(mapFn);
    expect(source.errorHandler).toEqual(errorHandler);
  });

  it(`throws if an environmnet source is invalid`, () => {
    const source1: any = { load: 0 };
    const error: Error = new InvalidSourceError(source1);

    expect(() => loaderSourceFactory(source1)).toThrowError(error);
  });
});
