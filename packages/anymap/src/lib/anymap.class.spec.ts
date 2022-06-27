import { Anymap } from './anymap.class';
import { ANYMAP_KEYS } from './anymap.keys';

const AnyMapKeys = Object.keys(ANYMAP_KEYS);

describe('Anymap', () => {
  it('.dict returns the elements of the anymap as a dictionary', () => {
    expect(new Anymap().include('null').dict).toEqual({ null: [null] });
  });

  it('.keys returns all the keys of the anymap', () => {
    const anymap = new Anymap().include('null', 'undefined');
    expect(anymap.keys).toEqual(['null', 'undefined']);
  });

  it('.values all the values of the anymap', () => {
    const anymap = new Anymap().include('null', 'undefined');
    expect(anymap.values).toEqual([null, undefined]);
  });

  it('.entries returns all entries of the anymap as [key, value] tuples', () => {
    const anymap = new Anymap().include('null', 'boolean');
    expect(anymap.entries).toEqual([
      ['null', null],
      ['boolean', true],
      ['boolean', false]
    ]);
  });

  it('add(elements) adds new elements to the anymap', () => {
    const anymap = new Anymap().include('string');
    const elements = { test: [0] };
    expect(anymap.add(elements).values).toEqual(['', 0]);
  });

  it('add(elements) adds the new value to the existing key', () => {
    const anymap = new Anymap().include('string');
    const elements = { string: ['a'] };
    expect(anymap.add(elements).values).toEqual(['', 'a']);
  });

  it('add(elements) adds new unique element values', () => {
    const anymap = new Anymap().include('string');
    const elements = { string: ['a', ''] };
    expect(anymap.add(elements).values).toEqual(['', 'a']);
  });

  it('clear() clears all the elements from the anymap', () => {
    expect(new Anymap().clear().keys).toEqual([]);
  });

  it('include(...keys) returns an anymap with the provided keys', () => {
    expect(new Anymap().include('null', 'undefined').keys).toEqual(['null', 'undefined']);
  });

  it('exclude(...keys) returns an anymap without the provided keys', () => {
    const filtered = AnyMapKeys.filter((k) => k !== 'null' && k !== 'undefined');
    expect(new Anymap().exclude('null', 'undefined').keys).toEqual(filtered);
  });

  it('union(anymap) combines two anymaps and returns the elements from both', () => {
    const anymap1 = new Anymap().include('null');
    const anymap2 = new Anymap().include('null', 'undefined');
    expect(anymap1.union(anymap2).keys).toEqual(['null', 'undefined']);
  });

  it("except(anymap) combines two anymaps and returns the elements from the first that doesn't exists in the second", () => {
    const anymap1 = new Anymap().include('null', 'undefined');
    const anymap2 = new Anymap().include('null');
    expect(anymap1.except(anymap2).keys).toEqual(['undefined']);
  });

  it('intersect(anymap) combines two anymaps and returns the elements from the first that exists in the second', () => {
    const anymap1 = new Anymap().include('null', 'undefined');
    const anymap2 = new Anymap().include('null');
    expect(anymap1.intersect(anymap2).keys).toEqual(['null']);
  });

  it('filter(predicate) filters the anymap values that meet the condition specified in a callback function', () => {
    const anymap = new Anymap().include('boolean').filter((v) => Boolean(v) === false);
    expect(anymap.keys).toEqual(['boolean']);
    expect(anymap.values).toEqual([false]);
  });

  it('filter(predicate) deletes the key if all values are filtered', () => {
    const anymap = new Anymap().include('null', 'boolean').filter((v) => typeof v !== 'boolean');
    expect(anymap.keys).toEqual(['null']);
  });

  function isFalsy(arg: any): boolean {
    return Boolean(arg) === false;
  }

  describe('isFalsy', () => {
    const falsy = new Anymap().filter((v) => Boolean(v) === false);
    const truthy = new Anymap().except(falsy);

    falsy.entries.forEach(([key, value]) => {
      it(`isFalsy(${key} ${String(value)}) returns true`, () => {
        expect(isFalsy(value)).toEqual(true);
      });
    });

    truthy.entries.forEach(([key, value]) => {
      it(`isFalsy(${key} ${String(value)}) returns false`, () => {
        expect(isFalsy(value)).toEqual(false);
      });
    });
  });
});
