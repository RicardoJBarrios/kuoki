/**
 * Creates a duplicated sources error.
 */
export class DuplicatedSourcesError extends Error {
  /**
   * Creates a duplicated sources error.
   * @param ids the duplicated sources id.
   */
  constructor(ids: string[]) {
    super(`There are sources with duplicate id's: ${ids.join(', ')}`);
    this.name = 'DuplicatedSourcesError';
  }
}
