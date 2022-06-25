import { Anymap } from './anymap.class';
import { isFalsy } from './anymap.filters';
import { ANYMAP_KEYS } from './anymap.keys';

const AnyMapKeys = Object.keys(ANYMAP_KEYS);

describe('Anymap', () => {
  it('.dict returns the record of keys and values', () => {
    expect(new Anymap().includes('null').dict).toEqual({ null: [null] });
  });

  it('.keys returns the array of keys', () => {
    const anymap = new Anymap().includes('null', 'undefined');
    expect(anymap.keys).toEqual(['null', 'undefined']);
  });

  it('.values returns the flattened array of values', () => {
    const anymap = new Anymap().includes('null', 'undefined');
    expect(anymap.values).toEqual([null, undefined]);
  });

  it('.entries returns an array of tuples with the key and the value', () => {
    const anymap = new Anymap().includes('null', 'boolean');
    expect(anymap.entries).toEqual([
      ['null', null],
      ['boolean', true],
      ['boolean', false]
    ]);
  });

  it('add(elements) adds the new elements', () => {
    const anymap = new Anymap().includes('string');
    const elements = { test: [0] };
    expect(anymap.add(elements).values).toEqual(['', 0]);
  });

  it('add(elements) adds custom elements to existing keys', () => {
    const anymap = new Anymap().includes('string');
    const elements = { string: ['a'] };
    expect(anymap.add(elements).values).toEqual(['', 'a']);
  });

  it('add(elements) adds custom elements as unique', () => {
    const anymap = new Anymap().includes('string');
    const elements = { string: ['a', ''] };
    expect(anymap.add(elements).values).toEqual(['', 'a']);
  });

  it('clear() clears all elements', () => {
    expect(new Anymap().clear().keys).toEqual([]);
  });

  it('includes(...keys) filter elements without the keys', () => {
    expect(new Anymap().includes('null', 'undefined').keys).toEqual(['null', 'undefined']);
  });

  it('excludes(...keys) filter elements with the keys', () => {
    const filtered = AnyMapKeys.filter((k) => k !== 'null' && k !== 'undefined');
    expect(new Anymap().excludes('null', 'undefined').keys).toEqual(filtered);
  });

  it('union(anymap) combines two Anymaps and returns the elements from both', () => {
    const anymap1 = new Anymap().includes('null');
    const anymap2 = new Anymap().includes('null', 'undefined');
    expect(anymap1.union(anymap2).keys).toEqual(['null', 'undefined']);
  });

  it('except(anymap) returns the elements not available in anymap', () => {
    const anymap1 = new Anymap().includes('null', 'undefined');
    const anymap2 = new Anymap().includes('null');
    expect(anymap1.except(anymap2).keys).toEqual(['undefined']);
  });

  it('intersect(anymap) returns the elements available in anymap', () => {
    const anymap1 = new Anymap().includes('null', 'undefined');
    const anymap2 = new Anymap().includes('null');
    expect(anymap1.intersect(anymap2).keys).toEqual(['null']);
  });

  it('filter(predicate) returns the filtered Anymap', () => {
    const anymap = new Anymap().includes('boolean').filter(isFalsy);
    expect(anymap.keys).toEqual(['boolean']);
    expect(anymap.values).toEqual([false]);
  });

  it('filter(predicate) deletes the keys if filters all values', () => {
    const anymap = new Anymap().includes('null', 'boolean').filter((v) => typeof v !== 'boolean');
    expect(anymap.keys).toEqual(['null']);
  });
});
