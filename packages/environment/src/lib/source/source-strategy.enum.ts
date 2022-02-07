/**
 * The strategy used to add the source properties to the environment.
 */
export enum SourceStrategy {
  /**
   * Overwrites the existing properties with the new ones.
   */
  ADD,
  /**
   * Deep merges the existing properties with the new ones, updating the final values.
   */
  MERGE
}
