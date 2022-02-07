import { ObservableInput } from 'rxjs';

import { EnvironmentSource, SourceStrategy } from '../source';
import { EnvironmentState } from '../store';
import { environmentSourcesFactory } from './environment-sources-factory.function';

class ExtendsEnvironmentSource extends EnvironmentSource {
  override id = 'ExtendsEnvironmentSource';
  load(): ObservableInput<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
}

class ImplementsEnvironmentSource implements EnvironmentSource {
  id = 'ImplementsEnvironmentSource';
  load(): ObservableInput<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
}

describe('environmentSourcesFactory()', () => {
  it(`() returns empty array`, () => {
    expect(environmentSourcesFactory()).toEqual([]);
    expect(environmentSourcesFactory(undefined)).toEqual([]);
  });

  it(`(source) returns the complete source form minimal abstract`, () => {
    const source = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(source.id).toEqual('ExtendsEnvironmentSource');
    expect(source.isRequired).toBeFalse();
    expect(source.isOrdered).toBeFalse();
    expect(source.strategy).toEqual(0);
    expect(source.ignoreError).toBeFalse();
    expect(source.path).toBeUndefined();
    expect(source.load).toBeFunction();
  });

  it(`(source) returns the complete source form custom abstract`, () => {
    const customSource = new ExtendsEnvironmentSource();
    customSource.id = 'test';
    customSource.isRequired = true;
    customSource.isOrdered = true;
    customSource.strategy = SourceStrategy.MERGE;
    customSource.ignoreError = true;
    customSource.path = 'a';
    const source = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    expect(source.id).toEqual('test');
    expect(source.isRequired).toBeTrue();
    expect(source.isOrdered).toBeTrue();
    expect(source.strategy).toEqual(1);
    expect(source.ignoreError).toBeTrue();
    expect(source.path).toEqual('a');
    expect(source.load).toBeFunction();
  });

  it(`(source) returns the complete source form minimal interface`, () => {
    const source = environmentSourcesFactory(new ImplementsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(source.id).toEqual('ImplementsEnvironmentSource');
    expect(source.isRequired).toBeFalse();
    expect(source.isOrdered).toBeFalse();
    expect(source.strategy).toEqual(0);
    expect(source.ignoreError).toBeFalse();
    expect(source.load).toBeFunction();
  });

  it(`(source) returns the complete source form custom interface`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.id = 'test';
    customSource.isRequired = true;
    customSource.isOrdered = true;
    customSource.strategy = SourceStrategy.MERGE;
    customSource.ignoreError = true;
    customSource.path = 'a';
    const source = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    expect(source.id).toEqual('test');
    expect(source.isRequired).toBeTrue();
    expect(source.isOrdered).toBeTrue();
    expect(source.strategy).toEqual(1);
    expect(source.ignoreError).toBeTrue();
    expect(source.path).toEqual('a');
    expect(source.load).toBeFunction();
  });

  it(`(source) returns source with .id`, () => {
    const custom = environmentSourcesFactory(new ImplementsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.id).toEqual('ImplementsEnvironmentSource');
    expect(original.id).toEqual('ExtendsEnvironmentSource');
  });

  it(`(source) returns source with .isRequired`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.isRequired = true;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.isRequired).toBeTrue();
    expect(original.isRequired).toBeFalse();
  });

  it(`(source) returns source with .isOrdered`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.isOrdered = true;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.isOrdered).toBeTrue();
    expect(original.isOrdered).toBeFalse();
  });

  it(`(source) returns source with .merge`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.strategy = SourceStrategy.MERGE;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.strategy).toEqual(1);
    expect(original.strategy).toEqual(0);
  });

  it(`(source) returns source with .ignoreError`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.ignoreError = true;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.ignoreError).toBeTrue();
    expect(original.ignoreError).toBeFalse();
  });

  it(`(source) returns source with .path`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.path = 'a';
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.path).toEqual('a');
    expect(original.path).toBeUndefined();
  });

  it(`(sources[]) returns all as complete sources`, () => {
    const sources: Required<EnvironmentSource>[] = environmentSourcesFactory([
      new ImplementsEnvironmentSource(),
      new ExtendsEnvironmentSource()
    ]);
    expect(sources).toBeArrayOfSize(2);
    expect(sources[0].id).toEqual('ImplementsEnvironmentSource');
    expect(sources[0].isRequired).toBeFalse();
    expect(sources[0].isOrdered).toBeFalse();
    expect(sources[0].strategy).toEqual(0);
    expect(sources[0].ignoreError).toBeFalse();
    expect(sources[0].path).toBeUndefined();
    expect(sources[0].load).toBeFunction();
    expect(sources[1].id).toEqual('ExtendsEnvironmentSource');
    expect(sources[1].isRequired).toBeFalse();
    expect(sources[1].isOrdered).toBeFalse();
    expect(sources[1].strategy).toEqual(0);
    expect(sources[1].ignoreError).toBeFalse();
    expect(sources[1].path).toBeUndefined();
    expect(sources[1].load).toBeFunction();
  });
});
