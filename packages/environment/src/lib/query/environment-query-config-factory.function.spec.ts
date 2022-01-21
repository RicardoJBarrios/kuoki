import { environmentQueryConfigFactory } from './environment-query-config-factory.function';

const defaultEnvironmentConfig = { interpolation: ['{{', '}}'], transpileEnvironment: false };

describe('environmentConfigFactory(config?)', () => {
  it(`() returns all the default values`, () => {
    expect(environmentQueryConfigFactory()).toEqual(defaultEnvironmentConfig);
  });

  it(`({}) returns all the default values`, () => {
    expect(environmentQueryConfigFactory({})).toEqual(defaultEnvironmentConfig);
  });

  it(`({ interpolation }) returns custom interpolation`, () => {
    expect(environmentQueryConfigFactory({ interpolation: ['(', ')'] })).toEqual(
      expect.objectContaining({ interpolation: ['(', ')'] })
    );
  });

  it(`({ transpileEnvironment }) returns custom value`, () => {
    expect(environmentQueryConfigFactory({ transpileEnvironment: true })).toEqual(
      expect.objectContaining({ transpileEnvironment: true })
    );
  });
});
