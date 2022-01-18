import { get, mergeWith, set } from 'lodash-es';

import { mutable } from '../helpers';
import { isPath, overwritesPath, Path, pathAsArray, pathAsString } from '../path';
import { mergeArraysCustomizer } from '../shared';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { EnvironmentResult } from './environment-result.type';

/**
 * Sets properties in the environment store.
 */
export class EnvironmentService {
  /**
   * Sets properties in the environment store.
   * @param store Stores the environment properties that the application needs.
   */
  constructor(protected readonly store: EnvironmentStore) {}

  /**
   * Resets the environment to the initial state.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Store reseted.
   * @example
   * ```js
   * // EnvironmentState = {a:0}
   * service.reset(); // {code:200}
   * // EnvironmentState = {}
   * ```
   */
  reset(): EnvironmentResult {
    this.store.reset();

    return { code: 200 };
  }

  /**
   * Creates a new property in the environment and sets the value.
   * Ignores the action if property path already exists or is an invalid path.
   * @param path The path of the property to create.
   * @param value The value of the property.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 201 Property created
   * - 400 Invalid path
   * - 422 Property path already exists
   * @example
   * ```js
   * // EnvironmentState = {}
   * service.create('a', 0); // {code:201,path:'a',value:0}
   * // EnvironmentState = {a:0}
   * service.create('2a', 0); // {code:400,path:'2a',value:0}
   * // EnvironmentState = {a:0}
   * service.create('a', 1); // {code:422,path:'a',value:1}
   * // EnvironmentState = {a:0}
   * ```
   */
  create(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return { code: 400, path: pathAsString(path), value };
    }

    path = pathAsArray(path);
    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property !== undefined || overwritesPath(path, state)) {
      return { code: 422, path: pathAsString(path), value };
    }

    this.upsertStore(state, path, value);

    return { code: 201, path: pathAsString(path), value };
  }

  /**
   * Updates the value of a property in the environment.
   * Ignores the action if property doesn't exist or is an invalid path.
   * @param path The path of the property to update.
   * @param value The value of the property.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Property updated
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * @example
   * ```js
   * // EnvironmentState = {a:0}
   * service.update('a', 1); // {code:200,path:'a',value:1}
   * // EnvironmentState = {a:1}
   * service.update('2a', 0); // {code:400,path:'2a',value:0}
   * // EnvironmentState = {a:1}
   * service.update('b', 1); // {code:422,path:'b',value:1}
   * // EnvironmentState = {a:1}
   * ```
   */
  update(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return { code: 400, path: pathAsString(path), value };
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return { code: 422, path: pathAsString(path), value };
    }

    this.upsertStore(state, path, value);

    return { code: 200, path: pathAsString(path), value };
  }

  /**
   * Updates or creates the value of a property in the environment.
   * Ignores the action if is an invalid path.
   * @param path The path of the property to upsert.
   * @param value The value of the property.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 201 Property created
   * - 200 Property updated
   * - 400 Invalid path
   * @example
   * ```js
   * // EnvironmentState = {a:0}
   * service.upsert('a', 1); // {code:200,path:'a',value:1}
   * // EnvironmentState = {a:1}
   * service.upsert('b', 1); // {code:201,path:'b',value:1}
   * // EnvironmentState = {a:1, b:1}
   * service.upsert('2a', 0); // {code:400,path:'2a',value:0}
   * // EnvironmentState = {a:1, b:1}
   * ```
   */
  upsert(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return { code: 400, path: pathAsString(path), value };
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    this.upsertStore(state, path, value);

    return { code: property === undefined ? 201 : 200, path: pathAsString(path), value };
  }

  /**
   * Deletes a property from the environment.
   * Ignores the action if property doesn't exist or is an invalid path.
   * @param path The path of the property to delete.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Property deleted
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * @example
   * ```js
   * // EnvironmentState = {a:0, b:1}
   * service.delete('a'); // {code:200,path:'a'}
   * // EnvironmentState = {b:1}
   * service.delete('2a'); // {code:400,path:'2a'}
   * // EnvironmentState = {b:1}
   * service.delete('a'); // {code:422,path:'a'}
   * // EnvironmentState = {b:1}
   * ```
   */
  delete(path: Path): EnvironmentResult {
    if (!isPath(path)) {
      return { code: 400, path: pathAsString(path) };
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return { code: 422, path: pathAsString(path) };
    }

    this.upsertStore(state, path);

    return { code: 200, path: pathAsString(path) };
  }

  protected upsertStore(state: EnvironmentState, path: Path, value?: Property): void {
    const mutableState: EnvironmentState = mutable(state);
    const newState: EnvironmentState = set(mutableState, path, value);

    this.store.update(newState);
  }

  /**
   * Adds properties to the environment.
   * Ignores the action if is an invalid path.
   * @param properties The properties to add.
   * @param path The path of the properties to add.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties added
   * - 400 Invalid path
   * @example
   * ```js
   * // EnvironmentState = {a:0}
   * service.add({a:1}); // {code:200,value:{a:1}}
   * // EnvironmentState = {a:1}
   * service.add({a:1}, 'a'); // {code:200,path:'a',value:{a:1}}
   * // EnvironmentState = {a:{a:1}}
   * service.add({b:1}, 'a'); // {code:200,path:'a',value:{b:1}}
   * // EnvironmentState = {a:{b:1}}
   * service.add({a:1}, '2a'); // {code:400,path:'2a',value:{a:1}}
   * // EnvironmentState = {a:{b:1}}
   * ```
   */
  add(properties: EnvironmentState, path?: Path): EnvironmentResult {
    if (path != null && !isPath(path)) {
      return { code: 400, value: properties, path: pathAsString(path) };
    }

    const state: EnvironmentState = mutable(this.store.getAll());
    const newState: EnvironmentState = path != null ? set(state, path, properties) : { ...state, ...properties };

    this.store.update(newState);

    return { code: 200, value: properties, path: path == null ? undefined : pathAsString(path) };
  }

  /**
   * Adds properties to the environment using the deep merge strategy.
   * Ignores the action if is an invalid path.
   * @param properties The properties to merge.
   * @param path The path of the properties to merge.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties merged
   * - 400 Invalid path
   * @example
   * ```js
   * // EnvironmentState = {a:0}
   * service.merge({a:1}); // {code:200,value:{a:1}}
   * // EnvironmentState = {a:1}
   * service.merge({a:1}, 'a'); // {code:200,path:'a',value:{a:1}}
   * // EnvironmentState = {a:{a:1}}
   * service.merge({b:1}, 'a'); // {code:200,path:'a',value:{b:1}}
   * // EnvironmentState = {a:{a:1,b:1}}
   * service.merge({a:1}, '2a'); // {code:400,path:'2a',value:{a:1}}
   * // EnvironmentState = {a:{a:1,b:1}}
   * ```
   */
  merge(properties: EnvironmentState, path?: Path): EnvironmentResult {
    if (path != null && !isPath(path)) {
      return { code: 400, value: properties, path: pathAsString(path) };
    }

    const state: EnvironmentState = mutable(this.store.getAll());
    const property: Property = path != null ? set({}, path, properties) : properties;
    const newState: EnvironmentState = mergeWith(state, property, mergeArraysCustomizer);

    this.store.update(newState);

    return { code: 200, value: properties, path: path == null ? undefined : pathAsString(path) };
  }
}
