/**
 * Represents an error when some EnvironmentSource are duplicated.
 */
export class DuplicatedEnvironmentSourcesError extends Error {
  ids!: string[];

  /**
   * Represents an error when some EnvironmentSource are duplicated.
   * @param ids the duplicated sources id.
   */
  constructor(ids: string[]) {
    super(`There are environment sources with duplicate id's: ${ids.join(', ')}`);
    this.name = 'DuplicatedEnvironmentSourcesError';
    this.ids = ids;
  }
}
