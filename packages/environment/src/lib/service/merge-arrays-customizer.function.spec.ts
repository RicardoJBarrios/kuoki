import { mergeArraysCustomizer } from './merge-arrays-customizer.function';

describe('mergeArraysCustomizer(obj, source)', () => {
  it(`returns the merged Array`, () => {
    const obj = [0];
    const source = [1];
    expect(mergeArraysCustomizer(obj, source)).toEqual([0, 1]);
  });

  it(`returns undefined if 'obj' is not Array`, () => {
    const obj = 0;
    const source = [1];
    expect(mergeArraysCustomizer(obj, source)).toBeUndefined();
  });

  it(`returns undefined if 'source' is not Array`, () => {
    const obj = [0];
    const source = 1;
    expect(mergeArraysCustomizer(obj, source)).toBeUndefined();
  });

  it(`returns undefined if 'obj' and 'source' are not Array`, () => {
    const obj = 0;
    const source = 1;
    expect(mergeArraysCustomizer(obj, source)).toBeUndefined();
  });
});
