import { isEnvironmentSource } from './is-environment-source.function';
import { SourceStrategy } from './source-strategy.enum';

describe('isEnvironmentSource(value)', () => {
  it(`returns false for null`, () => {
    expect(isEnvironmentSource(null)).toBeFalse();
  });

  it(`returns false for undefined`, () => {
    expect(isEnvironmentSource(undefined)).toBeFalse();
  });

  it(`returns false for {}`, () => {
    expect(isEnvironmentSource({})).toBeFalse();
  });

  it(`returns true for valid {load}`, () => {
    const source = { load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {load}`, () => {
    const source = { load: '' };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {id}`, () => {
    const source = { id: '' };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {id,load}`, () => {
    const source = { id: '', load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {id,load}`, () => {
    const source = { id: 0, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {isRequired}`, () => {
    const source = { isRequired: true };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {isRequired,load}`, () => {
    const source = { isRequired: true, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {isRequired,load}`, () => {
    const source = { isRequired: 0, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {isOrdered}`, () => {
    const source = { isOrdered: true };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {isOrdered,load}`, () => {
    const source = { isOrdered: true, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {isOrdered,load}`, () => {
    const source = { isOrdered: 0, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {ignoreError}`, () => {
    const source = { ignoreError: true };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {ignoreError,load}`, () => {
    const source = { ignoreError: true, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {ignoreError,load}`, () => {
    const source = { ignoreError: 0, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {strategy}`, () => {
    const source = { strategy: SourceStrategy.ADD };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {strategy,load}`, () => {
    const source = { strategy: SourceStrategy.ADD, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {strategy,load}`, () => {
    const source = { strategy: 100, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {path}`, () => {
    const source = { path: 'a' };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {path,load}`, () => {
    const source = { path: 'a', load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for invalid {path,load}`, () => {
    const source = { path: '2a', load: () => [''] };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns false for {mapFn}`, () => {
    const source = { mapFn: () => {} };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {mapFn,load}`, () => {
    const source = { mapFn: () => {}, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });

  it(`returns false for {errorHandler}`, () => {
    const source = { errorHandler: () => {} };
    expect(isEnvironmentSource(source)).toBeFalse();
  });

  it(`returns true for valid {errorHandler,load}`, () => {
    const source = { errorHandler: () => {}, load: () => [''] };
    expect(isEnvironmentSource(source)).toBeTrue();
  });
});
