import { get, mergeWith, set } from 'lodash-es';

import { asMutable, isValidPath, Path, pathAsArray, pathAsString } from '../shared';
import { Environment, EnvironmentStore, Property } from '../store';
import { EnvironmentActionResult } from './environment-action-result.type';
import { isOverwritingAPathValue } from './is-overwriting-a-path-value.function';
import { mergeArraysCustomizer } from './merge-arrays-customizer.function';

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
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 200 Store reseted.
   * @example
   * ```js
   * // Environment = {a:0}
   * service.reset(); // {code:200}
   * // Environment = {}
   * ```
   */
  reset(): EnvironmentActionResult {
    this.store.reset();

    return { code: 200 };
  }

  /**
   * Creates a new property in the environment and sets the value.
   * Ignores the action if property path already exists or invalid path.
   * @param path The path of the property to create.
   * @param value The value of the property.
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 201 Property created
   * - 400 Invalid path
   * - 422 Property path already exists
   * @example
   * ```js
   * // Environment = {}
   * service.create('a', 0); // {code:201, path:'a', value:0}
   * // Environment = {a:0}
   * service.create('a', 1); // {code:422, path:'a', value:1}
   * // Environment = {a:0}
   * service.create('2a', 0); // {code:400, path:'2a', value:0}
   * // Environment = {a:0}
   * ```
   */
  create(path: Path, value: Property): EnvironmentActionResult {
    if (!isValidPath(path)) {
      return { code: 400, path: pathAsString(path), value };
    }

    path = pathAsArray(path);
    const environment: Environment = this.store.getAll();
    const property: Property | undefined = get(environment, path);

    if (property !== undefined || isOverwritingAPathValue(path, environment)) {
      return { code: 422, path: pathAsString(path), value };
    }

    this.upsertStore(environment, path, value);

    return { code: 201, path: pathAsString(path), value };
  }

  /**
   * Updates the value of a property in the environment.
   * Ignores the action if property doesn't exist or invalid path.
   * @param path The path of the property to update.
   * @param value The value of the property.
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 200 Property updated
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * @example
   * ```js
   * // Environment = {a:0}
   * service.update('a', 1); // {code:200, path:'a', value:1}
   * // Environment = {a:1}
   * service.update('b', 1); // {code:422, path:'b', value:1}
   * // Environment = {a:1}
   * service.update('2a', 0); // {code:400, path:'2a', value:0}
   * // Environment = {a:1}
   * ```
   */
  update(path: Path, value: Property): EnvironmentActionResult {
    if (!isValidPath(path)) {
      return { code: 400, path: pathAsString(path), value };
    }

    const environment: Environment = this.store.getAll();
    const property: Property | undefined = get(environment, path);

    if (property === undefined) {
      return { code: 422, path: pathAsString(path), value };
    }

    this.upsertStore(environment, path, value);

    return { code: 200, path: pathAsString(path), value };
  }

  /**
   * Updates or creates the value of a property in the environment.
   * Ignores the action if invalid path.
   * @param path The path of the property to upsert.
   * @param value The value of the property.
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 201 Property created
   * - 200 Property updated
   * - 400 Invalid path
   * @example
   * ```js
   * // Environment = {a:0}
   * service.upsert('a', 1); // {code:200, path:'a', value:1}
   * // Environment = {a:1}
   * service.upsert('b', 1); // {code:201, path:'b', value:1}
   * // Environment = {a:1, b:1}
   * service.upsert('2a', 0); // {code:400, path:'2a', value:0}
   * // Environment = {a:1, b:1}
   * ```
   */
  upsert(path: Path, value: Property): EnvironmentActionResult {
    if (!isValidPath(path)) {
      return { code: 400, path: pathAsString(path), value };
    }

    const environment: Environment = this.store.getAll();
    const property: Property | undefined = get(environment, path);

    this.upsertStore(environment, path, value);

    return { code: property === undefined ? 201 : 200, path: pathAsString(path), value };
  }

  /**
   * Deletes a property from the environment.
   * Ignores the action if property doesn't exist or invalid path.
   * @param path The path of the property to delete.
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 201 Property deleted
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * @example
   * ```js
   * // Environment = {a:0, b:1}
   * service.delete('a'); // {code:200, path:'a'}
   * // Environment = {b:1}
   * service.delete('a'); // {code:422, path:'a'}
   * // Environment = {b:1}
   * service.delete('2a'); // {code:400, path:'2a'}
   * // Environment = {b:1}
   * ```
   */
  delete(path: Path): EnvironmentActionResult {
    if (!isValidPath(path)) {
      return { code: 400, path: pathAsString(path) };
    }

    const environment: Environment = this.store.getAll();
    const property: Property | undefined = get(environment, path);

    if (property === undefined) {
      return { code: 422, path: pathAsString(path) };
    }

    this.upsertStore(environment, path);

    return { code: 200, path: pathAsString(path) };
  }

  protected upsertStore(environment: Environment, path: Path, value?: Property): void {
    const mutableEnvironment: Environment = asMutable(environment);
    const newEnvironment: Environment = set(mutableEnvironment, path, value);

    this.store.update(newEnvironment);
  }

  /**
   * Adds properties to the environment.
   * Ignores the action if invalid path.
   * @param properties The properties to add.
   * @param path The path of the properties to add.
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 200 Properties added
   * - 400 Invalid path
   * @example
   * ```js
   * // Environment = {a:0}
   * service.add({a:1}); // {code:200, value:{a:1}}
   * // Environment = {a:1}
   * service.add({a:1}, 'a'); // {code:200, path:'a', value:{a:1}}
   * // Environment = {a:{a:1}}
   * service.add({b:1}, 'a'); // {code:200, path:'a', value:{b:1}}
   * // Environment = {a:{b:1}}
   * service.add({a:1}, '2a'); // {code:400, path:'2a', value:{a:1}}
   * // Environment = {a:{b:1}}
   * ```
   */
  add(properties: Environment, path?: Path): EnvironmentActionResult {
    if (path != null && !isValidPath(path)) {
      return { code: 400, value: properties, path: pathAsString(path) };
    }

    const environment: Environment = asMutable(this.store.getAll());
    const newEnvironment: Environment =
      path != null ? set(environment, path, properties) : { ...environment, ...properties };

    this.store.update(newEnvironment);

    return { code: 200, value: properties, path: path == null ? undefined : pathAsString(path) };
  }

  /**
   * Adds properties to the environment using the deep merge strategy.
   * Ignores the action if invalid path.
   * @param properties The properties to merge.
   * @param path The path of the properties to merge.
   * @returns The result as {@link EnvironmentActionResult} with the code:
   * - 200 Properties merged
   * - 400 Invalid path
   * @example
   * ```js
   * // Environment = {a:0}
   * service.merge({a:1}); // {code:200, value:{a:1}}
   * // Environment = {a:1}
   * service.merge({a:1}, 'a'); // {code:200, path:'a', value:{a:1}}
   * // Environment = {a:{a:1}}
   * service.merge({b:1}, 'a'); // {code:200, path:'a', value:{b:1}}
   * // Environment = {a:{a:1,b:1}}
   * service.merge({a:1}, '2a'); // {code:400, path:'2a', value:{a:1}}
   * // Environment = {a:{a:1,b:1}}
   * ```
   */
  merge(properties: Environment, path?: Path): EnvironmentActionResult {
    if (path != null && !isValidPath(path)) {
      return { code: 400, value: properties, path: pathAsString(path) };
    }

    const environment: Environment = asMutable(this.store.getAll());
    const propertiesAtPath: Environment = path != null ? set({}, path, properties) : properties;
    const newEnvironment: Environment = mergeWith(environment, propertiesAtPath, mergeArraysCustomizer);

    this.store.update(newEnvironment);

    return { code: 200, value: properties, path: path == null ? undefined : pathAsString(path) };
  }
}
