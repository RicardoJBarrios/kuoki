import { ObservableInput } from 'rxjs';
import { validate } from 'uuid';

import { EnvironmentSource } from '../source';
import { EnvironmentState } from '../store';
import { environmentSourcesFactory } from './environment-sources-factory.function';

class ExtendsEnvironmentSource extends EnvironmentSource {
  override name = 'ExtendsEnvironmentSource';
  load(): ObservableInput<EnvironmentState> {
    throw new Error('Method not implemented.');
  }
}

class ImplementsEnvironmentSource implements EnvironmentSource {
  name = 'ImplementsEnvironmentSource';
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
    expect(validate(source.id)).toBeTrue();
    expect(source.name).toEqual('ExtendsEnvironmentSource');
    expect(source.requiredToLoad).toBeFalse();
    expect(source.loadInOrder).toBeFalse();
    expect(source.mergeProperties).toBeFalse();
    expect(source.ignoreError).toBeFalse();
    expect(source.path).toBeUndefined();
    expect(source.load).toBeFunction();
  });

  it(`(source) returns the complete source form custom abstract`, () => {
    const customSource = new ExtendsEnvironmentSource();
    customSource.name = 'test';
    customSource.requiredToLoad = true;
    customSource.loadInOrder = true;
    customSource.mergeProperties = true;
    customSource.ignoreError = true;
    customSource.path = 'a';
    const source = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    expect(validate(source.id)).toBeTrue();
    expect(source.name).toEqual('test');
    expect(source.requiredToLoad).toBeTrue();
    expect(source.loadInOrder).toBeTrue();
    expect(source.mergeProperties).toBeTrue();
    expect(source.ignoreError).toBeTrue();
    expect(source.path).toEqual('a');
    expect(source.load).toBeFunction();
  });

  it(`(source) returns the complete source form minimal interface`, () => {
    const source = environmentSourcesFactory(new ImplementsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(validate(source.id)).toBeTrue();
    expect(source.name).toEqual('ImplementsEnvironmentSource');
    expect(source.requiredToLoad).toBeFalse();
    expect(source.loadInOrder).toBeFalse();
    expect(source.mergeProperties).toBeFalse();
    expect(source.ignoreError).toBeFalse();
    expect(source.load).toBeFunction();
  });

  it(`(source) returns the complete source form custom interface`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.name = 'test';
    customSource.requiredToLoad = true;
    customSource.loadInOrder = true;
    customSource.mergeProperties = true;
    customSource.ignoreError = true;
    customSource.path = 'a';
    const source = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    expect(validate(source.id)).toBeTrue();
    expect(source.name).toEqual('test');
    expect(source.requiredToLoad).toBeTrue();
    expect(source.loadInOrder).toBeTrue();
    expect(source.mergeProperties).toBeTrue();
    expect(source.ignoreError).toBeTrue();
    expect(source.path).toEqual('a');
    expect(source.load).toBeFunction();
  });

  it(`(source) returns source with .id`, () => {
    const custom = environmentSourcesFactory(new ImplementsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(validate(custom.id)).toBeTrue();
    expect(validate(original.id)).toBeTrue();
    expect(original.id).not.toEqual(custom.id);
  });

  it(`(source) returns source with .name`, () => {
    const custom = environmentSourcesFactory(new ImplementsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.name).toEqual('ImplementsEnvironmentSource');
    expect(original.name).toEqual('ExtendsEnvironmentSource');
  });

  it(`(source) returns source with .requiredToLoad`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.requiredToLoad = true;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.requiredToLoad).toBeTrue();
    expect(original.requiredToLoad).toBeFalse();
  });

  it(`(source) returns source with .loadInOrder`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.loadInOrder = true;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.loadInOrder).toBeTrue();
    expect(original.loadInOrder).toBeFalse();
  });

  it(`(source) returns source with .mergeProperties`, () => {
    const customSource: EnvironmentSource = new ImplementsEnvironmentSource();
    customSource.mergeProperties = true;
    const custom = environmentSourcesFactory(customSource).shift() as Required<EnvironmentSource>;
    const original = environmentSourcesFactory(new ExtendsEnvironmentSource()).shift() as Required<EnvironmentSource>;
    expect(custom.mergeProperties).toBeTrue();
    expect(original.mergeProperties).toBeFalse();
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
    expect(validate(sources[0].id)).toBeTrue();
    expect(sources[0].name).toEqual('ImplementsEnvironmentSource');
    expect(sources[0].requiredToLoad).toBeFalse();
    expect(sources[0].loadInOrder).toBeFalse();
    expect(sources[0].mergeProperties).toBeFalse();
    expect(sources[0].ignoreError).toBeFalse();
    expect(sources[0].path).toBeUndefined();
    expect(sources[0].load).toBeFunction();
    expect(validate(sources[1].id)).toBeTrue();
    expect(sources[1].name).toEqual('ExtendsEnvironmentSource');
    expect(sources[1].requiredToLoad).toBeFalse();
    expect(sources[1].loadInOrder).toBeFalse();
    expect(sources[1].mergeProperties).toBeFalse();
    expect(sources[1].ignoreError).toBeFalse();
    expect(sources[1].path).toBeUndefined();
    expect(sources[1].load).toBeFunction();
  });
});
