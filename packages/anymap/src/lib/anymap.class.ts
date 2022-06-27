import { flatten, mergeWith, uniq } from 'lodash-es';

import { ANYMAP_KEYS } from './anymap.keys';

/**
 * A helper class for testing use cases where the value is of type any.
 */
export class Anymap {
  private _dict: Record<string, any[] | undefined> = {};

  constructor() {
    this.add(ANYMAP_KEYS);
  }

  /**
   * Gets the elements of the anymap as a dictionary.
   */
  get dict(): Record<string, any[]> {
    return this._dict as Record<string, any[]>;
  }

  /**
   * Gets all the keys of the anymap.
   */
  get keys(): string[] {
    return Object.keys(this.dict);
  }

  /**
   * Gets all the values of the anymap.
   */
  get values(): any[] {
    return flatten(Object.values(this.dict));
  }

  /**
   * Gets all entries of the anymap as [key, value] tuples.
   */
  get entries(): [string, any][] {
    return this.keys.reduce((entries: [string, any][], key: string) => {
      const values: any[] = this.dict[key];

      values.forEach((value: any) => {
        entries.push([key, value]);
      });

      return entries;
    }, []);
  }

  /**
   * Adds new elements to the anymap.
   * If a key exists, adds the new value to the existing key.
   * @param elements The elements to add.
   * @returns The anymap with the added elements.
   */
  add(elements: Record<string, any[]>): Anymap {
    this._dict = mergeWith({ ...this.dict }, elements, mergeWithArray);

    return this;
  }

  /**
   * Clears all the elements from the anymap.
   * @returns The empty anymap.
   */
  clear(): Anymap {
    this._dict = {};

    return this;
  }

  /**
   * Returns an anymap with the provided keys.
   * @param keys The keys to include.
   * @returns The anymap with the provided keys.
   */
  include(...keys: string[]): Anymap {
    this._dict = keys.reduce((dict: Record<string, any[]>, key: string) => {
      const value: any[] | undefined = this.dict[key];

      if (value != null && value.length > 0) {
        dict[key] = value;
      }

      return dict;
    }, {});

    return this;
  }

  /**
   * Returns an anymap without the provided keys.
   * @param keys The keys to exclude.
   * @returns The anymap without the provided keys.
   */
  exclude(...keys: string[]): Anymap {
    keys.forEach((keyword: string) => {
      delete this._dict[keyword];
    });

    return this;
  }

  /**
   * Combines two anymaps and returns the elements from both.
   * @param anymap The second anymap.
   * @returns The anymap with elements from both.
   */
  union(anymap: Anymap): Anymap {
    this._dict = mergeWith({ ...this.dict }, { ...anymap.dict }, mergeWithArray);

    return this;
  }

  /**
   * Combines two anymaps and returns the elements from the first that doesn't exists in the second.
   * @param anymap The second anymap.
   * @returns The anymap with elements not in `anymap`.
   */
  except(anymap: Anymap): Anymap {
    this.exclude(...anymap.keys);

    return this;
  }

  /**
   * Combines two anymaps and returns the elements from the first that exists in the second.
   * @param anymap The second anymap.
   * @returns The anymap with elements in `anymap`.
   */
  intersect(anymap: Anymap): Anymap {
    this.include(...anymap.keys);

    return this;
  }

  /**
   * Filters the anymap values that meet the condition specified in a callback function.
   * Deletes the key if all values are filtered.
   * @param predicate A function that accepts one argument.
   * @returns The filtered anymap.
   */
  filter(predicate: (value: any) => boolean): Anymap {
    this.keys.forEach((key: string) => {
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
