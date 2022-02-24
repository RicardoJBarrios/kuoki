import { InvalidSourceError } from './invalid-source.error';

class TestSource {}

function testFn() {}

describe('InvalidSourceError', () => {
  it(`name is InvalidSourceError`, () => {
    const error = new InvalidSourceError({});
    expect(error.name).toEqual('InvalidSourceError');
  });

  it(`message displayed with null`, () => {
    const error = new InvalidSourceError(null);
    expect(error.message).toEqual(`The source "null" is invalid`);
  });

  it(`message displayed with undefined`, () => {
    const error = new InvalidSourceError(undefined);
    expect(error.message).toEqual(`The source "undefined" is invalid`);
  });

  it(`message displayed with id`, () => {
    const error = new InvalidSourceError({ id: 'a' });
    expect(error.message).toEqual(`The source "a" is invalid`);
  });

  it(`message displayed with function name`, () => {
    const error = new InvalidSourceError(testFn);
    expect(error.message).toEqual(`The source "testFn" is invalid`);
  });

  it(`message displayed with function var name`, () => {
    const source = () => 0;
    const error = new InvalidSourceError(source);
    expect(error.message).toEqual(`The source "source" is invalid`);
  });

  it(`message displayed with class name`, () => {
    const error = new InvalidSourceError(new TestSource());
    expect(error.message).toEqual(`The source "TestSource" is invalid`);
  });

  it(`message displayed with plain object body as string`, () => {
    const error = new InvalidSourceError({ a: 0, load: () => null });
    expect(error.message).toEqual(`The source "{"a":0,"load":"() => null"}" is invalid`);
  });

  it(`message displayed with anonymous function name as string`, () => {
    const error = new InvalidSourceError(() => ({ a: 0 }));
    expect(error.message).toEqual(`The source "() => ({ a: 0 })" is invalid`);
  });

  it(`message displayed as string`, () => {
    const error = new InvalidSourceError(0);
    expect(error.message).toEqual(`The source "0" is invalid`);
  });

  it(`stack is defined`, () => {
    const error = new InvalidSourceError({});
    expect(error.stack).toBeDefined();
  });
});
