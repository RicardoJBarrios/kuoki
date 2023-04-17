import { Path } from '../path';
import { EnvironmentState, Property } from '../store';
import { EnvironmentResult } from './environment-result.type';

/**
 * Sets the EnvironmentState properties.
 */
export abstract class EnvironmentService {
  /**
   * Resets the EnvironmentState to the initial state.
   * @returns EnvironmentResult with the code:
   * - 205 Store resetted
   * - 460 Store error
   */
  abstract reset(): EnvironmentResult;

  /**
   * Creates a new property in the EnvironmentState and sets the value.
   * Ignores the action if property path already exists or is an invalid path.
   * @param path The EnvironmentState path to create.
   * @param value The value of the property.
   * @returns EnvironmentResult with the code:
   * - 201 Property created
   * - 400 Invalid path
   * - 422 Property path already exists
   * - 460 Store error
   */
  abstract create(path: Path, value: Property): EnvironmentResult;

  /**
   * Updates the value of a property in the EnvironmentState.
   * Ignores the action if property doesn't exist or is an invalid path.
   * @param path The EnvironmentState path to update.
   * @param value The value of the property.
   * @returns EnvironmentResult with the code:
   * - 200 Property updated
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * - 460 Store error
   */
  abstract update(path: Path, value: Property): EnvironmentResult;

  /**
   * Updates or creates the value of a property in the EnvironmentState.
   * Ignores the action if is an invalid path.
   * @param path The EnvironmentState path to upsert.
   * @param value The value of the property.
   * @returns EnvironmentResult with the code:
   * - 201 Property created
   * - 200 Property updated
   * - 400 Invalid path
   * - 460 Store error
   */
  abstract upsert(path: Path, value: Property): EnvironmentResult;

  /**
   * Deletes a property from the EnvironmentState.
   * Ignores the action if property doesn't exist or is an invalid path.
   * @param path The EnvironmentState path to delete.
   * @returns EnvironmentResult with the code:
   * - 204 Property deleted
   * - 400 Invalid path
   * - 422 Property doesn't exist
   * - 460 Store error
   */
  abstract delete(path: Path): EnvironmentResult;

  /**
   * Adds properties to the EnvironmentState overwriting the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to add.
   * @param path The EnvironmentState path to add.
   * @returns EnvironmentResult with the code:
   * - 200 Properties added
   * - 400 Invalid path
   * - 460 Store error
   */
  abstract add(properties: EnvironmentState, path?: Path): EnvironmentResult;

  /**
   * Adds properties to the EnvironmentState preserving the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to add.
   * @param path The EnvironmentState path to add.
   * @returns EnvironmentResult with the code:
   * - 200 Properties added
   * - 400 Invalid path
   * - 460 Store error
   */
  abstract addPreserving(properties: EnvironmentState, path?: Path): EnvironmentResult;

  /**
   * Adds properties to the EnvironmentState merging the values and overwriting the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to merge.
   * @param path The EnvironmentState path to merge.
   * @returns EnvironmentResult with the code:
   * - 200 Properties merged
   * - 400 Invalid path
   * - 460 Store error
   */
  abstract merge(properties: EnvironmentState, path?: Path): EnvironmentResult;

  /**
   * Adds properties to the EnvironmentState merging the values and preserving the existing ones.
   * Ignores the action if is an invalid path.
   * @param properties The properties to merge.
   * @param path The EnvironmentState path to merge.
   * @returns EnvironmentResult with the code:
   * - 200 Properties merged
   * - 400 Invalid path
   * - 460 Store error
   */
  abstract mergePreserving(properties: EnvironmentState, path?: Path): EnvironmentResult;
}
