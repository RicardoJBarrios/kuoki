import { flatten, mergeWith, uniq } from 'lodash-es';

import { ANYMAP_KEYS } from './anymap.keys';

export class Anymap {
  private _dict: Record<string, any[] | undefined> = {};

  constructor() {
    this.add(ANYMAP_KEYS);
  }

  get dict(): Record<string, any[]> {
    return this._dict as Record<string, any[]>;
  }

  get keys(): string[] {
    return Object.keys(this.dict);
  }

  get values(): any[] {
    return flatten(Object.values(this.dict));
  }

  get entries(): [string, any][] {
    return this.keys.reduce((prev: [string, any][], key: string) => {
      const values: any[] = this.dict[key];

      values.forEach((value: any) => {
        prev.push([key, value]);
      });

      return prev;
    }, []);
  }

  add(elements: Record<string, any[]>): Anymap {
    this._dict = mergeWith({ ...this.dict }, elements, mergeWithArray);

    return this;
  }

  clear(): Anymap {
    this._dict = {};

    return this;
  }

  includes(...keys: string[]): Anymap {
    this._dict = keys.reduce((record: Record<string, any[]>, keyword: string) => {
      const value: any[] | undefined = this.dict[keyword];

      if (value != null && value.length > 0) {
        record[keyword] = value;
      }

      return record;
    }, {});

    return this;
  }

  excludes(...keys: string[]): Anymap {
    keys.forEach((keyword: string) => {
      delete this._dict[keyword];
    });

    return this;
  }

  /**
   * Combines two Anymaps and returns the elements from both.
   * @param anymap The second Anymap.
   * @returns The elements from both Anymaps.
   */
  union(anymap: Anymap): Anymap {
    this._dict = mergeWith({ ...this.dict }, { ...anymap.dict }, mergeWithArray);

    return this;
  }

  /**
   * Combines two Anymaps and returns only the elements from the first Anymap that doesn't exists in the second Anymap.
   * @param anymap The second Anymap.
   * @returns The elements not available in `anymap`.
   */
  except(anymap: Anymap): Anymap {
    this.excludes(...anymap.keys);

    return this;
  }

  /**
   * Combines two Anymaps and returns only the elements from the first Anymap that exists in the second Anymap.
   * @param anymap The second Anymap.
   * @returns The elements available in `anymap`.
   */
  intersect(anymap: Anymap): Anymap {
    this.includes(...anymap.keys);

    return this;
  }

  /**
   * Returns the elements of an Anymap that meet the condition specified in a callback function.
   * @param predicate A function that accepts one argument.
   * @returns The filtered Anymap.
   */
  filter(predicate: (value: any) => boolean): Anymap {
    Object.keys(this.dict).forEach((key: string) => {
      const filteredValues = this.dict[key].filter((value: any) => predicate(value));

      if (filteredValues.length > 0) {
        this._dict[key] = filteredValues;
      } else {
        delete this._dict[key];
      }
    });

    return this;
  }
}

function mergeWithArray(objValue: any, srcValue: any): any[] | undefined {
  if (Array.isArray(objValue)) {
    return uniq(objValue.concat(srcValue));
  }

  return undefined;
}
