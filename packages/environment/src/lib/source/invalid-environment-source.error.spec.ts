import { InvalidEnvironmentSourceError } from './invalid-environment-source.error';

class TestSource {}

function testFn() {}

describe('InvalidEnvironmentSourceError', () => {
  it(`#name is InvalidEnvironmentSourceError`, () => {
    const error = new InvalidEnvironmentSourceError({});
    expect(error.name).toEqual('InvalidEnvironmentSourceError');
  });

  it(`#message displayed with null`, () => {
    const error = new InvalidEnvironmentSourceError(null);
    expect(error.message).toEqual(`The source "null" is invalid`);
  });

  it(`#message displayed with undefined`, () => {
    const error = new InvalidEnvironmentSourceError(undefined);
    expect(error.message).toEqual(`The source "undefined" is invalid`);
  });

  it(`#message displayed with id`, () => {
    const error = new InvalidEnvironmentSourceError({ id: 'a' });
    expect(error.message).toEqual(`The source "a" is invalid`);
  });

  it(`#message displayed with function name`, () => {
    const error = new InvalidEnvironmentSourceError(testFn);
    expect(error.message).toEqual(`The source "testFn" is invalid`);
  });

  it(`#message displayed with function var name`, () => {
    const source = () => 0;
    const error = new InvalidEnvironmentSourceError(source);
    expect(error.message).toEqual(`The source "source" is invalid`);
  });

  it(`#message displayed with class name`, () => {
    const error = new InvalidEnvironmentSourceError(new TestSource());
    expect(error.message).toEqual(`The source "TestSource" is invalid`);
  });

  it(`#message displayed with plain object body as string`, () => {
    const error = new InvalidEnvironmentSourceError({ a: 0, load: () => null });
    expect(error.message).toEqual(`The source "{"a":0,"load":"() => null"}" is invalid`);
  });

  it(`#message displayed with anonymous function name as string`, () => {
    const error = new InvalidEnvironmentSourceError(() => ({ a: 0 }));
    expect(error.message).toEqual(`The source "() => ({ a: 0 })" is invalid`);
  });

  it(`#message displayed as string`, () => {
    const error = new InvalidEnvironmentSourceError(0);
    expect(error.message).toEqual(`The source "0" is invalid`);
  });

  it(`#suorce stored`, () => {
    const error = new InvalidEnvironmentSourceError({ id: 'a' });
    expect(error.source).toEqual({ id: 'a' });
  });

  it(`#stack is defined`, () => {
    const error = new InvalidEnvironmentSourceError({});
    expect(error.stack).toBeDefined();
  });
});
