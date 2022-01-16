import { environmentConfigFactory } from './environment-config-factory.function';

const defaultEnvironmentConfig = { interpolation: ['{{', '}}'], transpileEnvironment: false };

describe('environmentConfigFactory(config?)', () => {
  it(`() returns all the default values`, () => {
    expect(environmentConfigFactory()).toEqual(defaultEnvironmentConfig);
  });

  it(`({}) returns all the default values`, () => {
    expect(environmentConfigFactory({})).toEqual(defaultEnvironmentConfig);
  });

  it(`({ interpolation }) returns custom interpolation`, () => {
    expect(environmentConfigFactory({ interpolation: ['(', ')'] })).toEqual(
      expect.objectContaining({ interpolation: ['(', ')'] }),
    );
  });

  it(`({ transpileEnvironment }) returns custom value`, () => {
    expect(environmentConfigFactory({ transpileEnvironment: true })).toEqual(
      expect.objectContaining({ transpileEnvironment: true }),
    );
  });
});
