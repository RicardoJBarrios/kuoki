import { get, mergeWith, set } from 'lodash-es';

import { PropertyPathDoesntExistError } from '.';
import { asError, mutable } from '../helpers';
import { InvalidPathError, isPath, overwritesPath, Path, pathAsArray, pathAsString } from '../path';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';
import { EnvironmentResult } from './environment-result.type';
import { PropertyPathExistsError } from './property-path-exists.error';

/**
 * Sets properties in the environment store.
 * @template STORE The store used by the implementation.
 * @template RESULT The operation result used by the implementation.
 */
export class EnvironmentService<
  STORE extends EnvironmentStore = EnvironmentStore,
  RESULT extends EnvironmentResult = EnvironmentResult
> {
  /**
   * Sets properties in the environment store.
   * @param store Stores the environment properties that the application needs.
   */
  constructor(protected readonly store: STORE) {}

  /**
   * Resets the environment to the initial state.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 205 Store resetted
   * - 460 Store error
   */
  reset(): RESULT {
    try {
      this.store.reset();
    } catch (error) {
      return this.returnCode(EnvironmentResultCode.STORE_ERROR, { error });
    }

    return this.returnCode(EnvironmentResultCode.RESET);
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
   * - 460 Store error
   */
  create(path: Path, value: Property): RESULT {
    if (!isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path, value });
    }

    path = pathAsArray(path);
    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property !== undefined || overwritesPath(path, state)) {
      return this.returnCode(EnvironmentResultCode.UNPROCESSABLE, {
        path,
        value,
        error: new PropertyPathExistsError(path)
      });
    }

    return this.upsertValue(state, path, value) ?? this.returnCode(EnvironmentResultCode.CREATED, { path, value });
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
   * - 460 Store error
   */
  update(path: Path, value: Property): RESULT {
    if (!isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path, value });
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return this.returnCode(EnvironmentResultCode.UNPROCESSABLE, {
        path,
        value,
        error: new PropertyPathDoesntExistError(path)
      });
    }

    return this.upsertValue(state, path, value) ?? this.returnCode(EnvironmentResultCode.UPDATED, { path, value });
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
   * - 460 Store error
   */
  upsert(path: Path, value: Property): RESULT {
    if (!isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path, value });
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    return (
      this.upsertValue(state, path, value) ??
      this.returnCode(property === undefined ? EnvironmentResultCode.CREATED : EnvironmentResultCode.UPDATED, {
        path,
        value
      })
    );
  }

  /**
   * Deletes a property from the environment.
   * Ignores the action if property doesn't exist or is an invalid path.
   * @param path The path of the property to delete.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 204 Property deleted
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * - 460 Store error
   */
  delete(path: Path): RESULT {
    if (!isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path });
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return this.returnCode(EnvironmentResultCode.UNPROCESSABLE, {
        path,
        error: new PropertyPathDoesntExistError(path)
      });
    }

    return this.upsertValue(state, path) ?? this.returnCode(EnvironmentResultCode.DELETED, { path });
  }

  protected upsertValue(state: EnvironmentState, path: Path, value?: Property): RESULT | void {
    const mutableState: EnvironmentState = mutable(state);
    const newState: EnvironmentState = set(mutableState, path, value);
    try {
      return this.store.update(newState);
    } catch (error) {
      return this.returnCode(EnvironmentResultCode.STORE_ERROR, { path, value, error });
    }
  }

  /**
   * Adds properties to the environment overwriting the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to add.
   * @param path The path of the properties to add.
   * @returns The result as {@link EnvironmentResult} with the code:
   * - 200 Properties added
   * - 400 Invalid path
   * - 460 Store error
   */
  add(properties: EnvironmentState, path?: Path): RESULT {
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
   * - 460 Store error
   */
  addPreserving(properties: EnvironmentState, path?: Path): RESULT {
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
   * - 460 Store error
   */
  merge(properties: EnvironmentState, path?: Path): RESULT {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) =>
        mergeWith(state, newProperties, this.mergeCustomizer),
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
   * - 460 Store error
   */
  mergePreserving(properties: EnvironmentState, path?: Path): RESULT {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) =>
        mergeWith(newProperties, state, this.reverseMergeCustomizer),
      properties,
      path
    );
  }

  protected upsertProperties(
    resolveFn: (state: EnvironmentState, newProperties: EnvironmentState) => EnvironmentState,
    properties: EnvironmentState,
    path?: Path
  ): RESULT {
    if (path != null && !isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path, value: properties });
    }

    const mutableState: EnvironmentState = mutable(this.store.getAll());
    const newProperties: Property = path != null ? set({}, path, properties) : { ...properties };
    const newState: EnvironmentState = resolveFn(mutableState, newProperties);

    try {
      this.store.update(newState);
    } catch (error) {
      return this.returnCode(EnvironmentResultCode.STORE_ERROR, { value: properties, path, error });
    }

    return this.returnCode(EnvironmentResultCode.UPDATED, { value: properties, path });
  }

  protected returnCode(code: RESULT['code'], optionals?: { [key: string]: unknown }): RESULT {
    if (optionals != null) {
      const error: unknown = get(optionals, 'error');
      if (error != null) {
        set(optionals, 'error', asError(error));
      }

      const path: unknown = get(optionals, 'path');
      if (path != null) {
        if (isPath(path)) {
          set(optionals, 'path', pathAsString(path));
        } else {
          set(optionals, 'error', new InvalidPathError(path));
        }
      }
    }

    return { code, ...optionals } as RESULT;
  }

  protected mergeCustomizer<O, S>(obj: O, source: S): (O | S)[] | undefined {
    if (Array.isArray(obj) && Array.isArray(source)) {
      return [...obj, ...source];
    }

    return undefined;
  }

  protected reverseMergeCustomizer<O, S>(obj: O, source: S): (O | S)[] | undefined {
    if (Array.isArray(obj) && Array.isArray(source)) {
      return [...source, ...obj];
    }

    return undefined;
  }
}
