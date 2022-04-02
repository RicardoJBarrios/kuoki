import { get, mergeWith, set } from 'lodash-es';

import { asError, mutable } from '../helpers';
import {
  InvalidPathError,
  isPath,
  overwritesPath,
  Path,
  pathAsArray,
  pathAsString,
  PathDoesntExistError,
  PathExistsError
} from '../path';
import { EnvironmentState, EnvironmentStore, Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';
import { EnvironmentResult } from './environment-result.type';
import { EnvironmentService } from './environment-service.interface';

/**
 * Sets the environment properties in the store.
 */
export class DefaultEnvironmentService implements EnvironmentService {
  /**
   * Sets the environment properties in the store.
   * @param store The store used by the implementation.
   */
  constructor(protected readonly store: EnvironmentStore) {}

  reset(): EnvironmentResult {
    try {
      this.store.reset();
    } catch (error) {
      return this.returnCode(EnvironmentResultCode.STORE_ERROR, { error });
    }

    return this.returnCode(EnvironmentResultCode.RESET);
  }

  create(path: Path, value: Property): EnvironmentResult {
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
        error: new PathExistsError(path)
      });
    }

    return this.upsertValue(state, path, value) ?? this.returnCode(EnvironmentResultCode.CREATED, { path, value });
  }

  update(path: Path, value: Property): EnvironmentResult {
    if (!isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path, value });
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return this.returnCode(EnvironmentResultCode.UNPROCESSABLE, {
        path,
        value,
        error: new PathDoesntExistError(path)
      });
    }

    return this.upsertValue(state, path, value) ?? this.returnCode(EnvironmentResultCode.UPDATED, { path, value });
  }

  upsert(path: Path, value: Property): EnvironmentResult {
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

  delete(path: Path): EnvironmentResult {
    if (!isPath(path)) {
      return this.returnCode(EnvironmentResultCode.INVALID_PATH, { path });
    }

    const state: EnvironmentState = this.store.getAll();
    const property: Property | undefined = get(state, path);

    if (property === undefined) {
      return this.returnCode(EnvironmentResultCode.UNPROCESSABLE, {
        path,
        error: new PathDoesntExistError(path)
      });
    }

    return this.upsertValue(state, path) ?? this.returnCode(EnvironmentResultCode.DELETED, { path });
  }

  protected upsertValue(state: EnvironmentState, path: Path, value?: Property): EnvironmentResult | void {
    const mutableState: EnvironmentState = mutable(state);
    const newState: EnvironmentState = set(mutableState, path, value);
    try {
      return this.store.update(newState);
    } catch (error) {
      return this.returnCode(EnvironmentResultCode.STORE_ERROR, { path, value, error });
    }
  }

  add(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) => ({ ...state, ...newProperties }),
      properties,
      path
    );
  }

  addPreserving(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) => ({ ...newProperties, ...state }),
      properties,
      path
    );
  }

  merge(properties: EnvironmentState, path?: Path): EnvironmentResult {
    return this.upsertProperties(
      (state: EnvironmentState, newProperties: EnvironmentState) =>
        mergeWith(state, newProperties, this.mergeCustomizer),
      properties,
      path
    );
  }

  mergePreserving(properties: EnvironmentState, path?: Path): EnvironmentResult {
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
  ): EnvironmentResult {
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

  protected returnCode(code: EnvironmentResult['code'], optionals?: { [key: string]: unknown }): EnvironmentResult {
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

    return { code, ...optionals } as EnvironmentResult;
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
