import { getOptionsFactory } from './get-options-factory.function';

describe('getOptionsFactory(config?)', () => {
  it(`returns {} if no options`, () => {
    expect(getOptionsFactory()).toEqual({});
  });

  it(`returns {defaultValue} if {defaultValue}`, () => {
    const options = { defaultValue: 0 };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {targetType} if {targetType}`, () => {
    const options = { targetType: (a: unknown) => a };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {transpile} if {transpile}`, () => {
    const options = { transpile: {} };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {config} if {config}`, () => {
    const options = { config: {} };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {defaultValue,targetType,transpile,config} if {defaultValue,targetType,transpile,config}`, () => {
    const options = { defaultValue: 0, targetType: (a: unknown) => a, transpile: {}, config: {} };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {dueTime} if {dueTime}`, () => {
    const options = { dueTime: 0 };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {defaultValue,targetType,transpile,config,dueTime} if {defaultValue,targetType,transpile,config,dueTime}`, () => {
    const options = { defaultValue: 0, targetType: (a: unknown) => a, transpile: {}, config: {}, dueTime: 0 };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {required} if {required}`, () => {
    const options = { required: true };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {defaultValue,targetType,transpile,config,required} if {defaultValue,targetType,transpile,config,required}`, () => {
    const options = { defaultValue: 0, targetType: (a: unknown) => a, transpile: {}, config: {}, required: true };
    expect(getOptionsFactory(options)).toEqual(options);
  });

  it(`returns {required} if {required,dueTime}`, () => {
    const options = { required: true, dueTime: 0 };
    expect(getOptionsFactory(options)).toEqual({ required: true });
  });

  it(`returns {defaultValue,targetType,transpile,config,required} if {defaultValue,targetType,transpile,config,required,dueTime}`, () => {
    const result = {
      defaultValue: 0,
      targetType: (a: unknown) => a,
      transpile: {},
      config: {},
      required: true
    };
    const options = {
      ...result,
      dueTime: 0
    };
    expect(getOptionsFactory(options)).toEqual(result);
  });
});
