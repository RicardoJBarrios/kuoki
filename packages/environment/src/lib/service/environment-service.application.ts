import { get, mergeWith, set } from 'lodash-es';

import { mutable } from '../helpers';
import { isPath, overwritesPath, Path, pathAsArray, pathAsString } from '../path';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';
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
   * - 205 Store reseted.
   */
  reset(): EnvironmentResult {
    this.store.reset();

    return { code: EnvironmentResultCode.RESET };
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
   */
  create(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return { code: EnvironmentResultCode.INVALID_PATH, path: pathAsString(path), value };
    }

    path = pathAsArray(path);
    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property !== undefined || overwritesPath(path, state)) {
      return { code: EnvironmentResultCode.UNPROCESSABLE, path: pathAsString(path), value };
    }

    this.upsertValue(state, path, value);

    return { code: EnvironmentResultCode.CREATED, path: pathAsString(path), value };
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
   */
  update(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return { code: EnvironmentResultCode.INVALID_PATH, path: pathAsString(path), value };
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return { code: EnvironmentResultCode.UNPROCESSABLE, path: pathAsString(path), value };
    }

    this.upsertValue(state, path, value);

    return { code: EnvironmentResultCode.UPDATED, path: pathAsString(path), value };
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
   */
  upsert(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return { code: EnvironmentResultCode.INVALID_PATH, path: pathAsString(path), value };
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    this.upsertValue(state, path, value);

    return {
      code: property === undefined ? EnvironmentResultCode.CREATED : EnvironmentResultCode.UPDATED,
      path: pathAsString(path),
      value
    };
  }

  /**
   * Deletes a property from the environment.
   * Ignores the action if property doesn't exist or is an invalid path.
   * @param path The path of the property to delete.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 204 Property deleted
   * - 400 Invalid path
   * - 422 Property doesn't exist
   */
  delete(path: Path): EnvironmentResult {
    if (!isPath(path)) {
      return { code: EnvironmentResultCode.INVALID_PATH, path: pathAsString(path) };
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return { code: EnvironmentResultCode.UNPROCESSABLE, path: pathAsString(path) };
    }

    this.upsertValue(state, path);

    return { code: EnvironmentResultCode.DELETED, path: pathAsString(path) };
  }

  protected upsertValue(state: EnvironmentState, path: Path, value?: Property): void {
    const mutableState: EnvironmentState = mutable(state);
    const newState: EnvironmentState = set(mutableState, path, value);

    this.store.update(newState);
  }

  /**
   * Adds properties to the environment overwriting the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to add.
   * @param path The path of the properties to add.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties added
   * - 400 Invalid path
   */
  add(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) => ({ ...state, ...newProperties }),
      properties,
      path
    );
  }

  /**
   * Adds properties to the environment preserving the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to add.
   * @param path The path of the properties to add.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties added
   * - 400 Invalid path
   */
  addPreserving(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) => ({ ...newProperties, ...state }),
      properties,
      path
    );
  }

  /**
   * Adds properties to the environment using the deep merge overwriting strategy.
   * Ignores the action if is an invalid path.
   * @param properties The properties to merge.
   * @param path The path of the properties to merge.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties merged
   * - 400 Invalid path
   */
  merge(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) => mergeWith(state, newProperties, mergeCustomizer),
      properties,
      path
    );
  }

  /**
   * Adds properties to the environment using the deep merge preserving strategy.
   * Ignores the action if is an invalid path.
   * @param properties The properties to merge.
   * @param path The path of the properties to merge.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties merged
   * - 400 Invalid path
   */
  mergePreserving(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) =>
        mergeWith(newProperties, state, reverseMergeCustomizer),
      properties,
      path
    );
  }

  protected upsertProperties(
    resolveFn: (state: EnvironmentState, newProperties: EnvironmentState) => EnvironmentState,
    properties: EnvironmentState,
    path?: Path
  ): EnvironmentResult {
    if (path != null && !isPath(path)) {
      return { code: EnvironmentResultCode.INVALID_PATH, value: properties, path: pathAsString(path) };
    }

    const mutableState: EnvironmentState = mutable(this.store.getAll());
    const newProperties: Property = path != null ? set({}, path, properties) : { ...properties };
    const newState: EnvironmentState = resolveFn(mutableState, newProperties);

    this.store.update(newState);

    return {
      code: EnvironmentResultCode.UPDATED,
      value: properties,
      path: path == null ? undefined : pathAsString(path)
    };
  }
}

function mergeCustomizer<O, S>(obj: O, source: S): (O | S)[] | undefined {
  if (Array.isArray(obj) && Array.isArray(source)) {
    return [...obj, ...source];
  }

  return undefined;
}

function reverseMergeCustomizer<O, S>(obj: O, source: S): (O | S)[] | undefined {
  if (Array.isArray(obj) && Array.isArray(source)) {
    return [...source, ...obj];
  }

  return undefined;
}
