/**
 * The strategy used to add the source properties to the environment.
 */
export enum SourceStrategy {
  /**
   * Add the new properties overwriting the existing ones.
   */
  ADD,
  /**
   * Deep merges the existing properties with the new ones, overwriting the existing ones.
   */
  MERGE,
  /**
   * Add the new properties preserving the existing ones.
   */
  ADD_PRESERVING,
  /**
   * Deep merges the existing properties with the new ones, preserving the existing ones.
   */
  MERGE_PRESERVING
}
