/**
 * The result of an environment mutation operation.
 */
export enum EnvironmentResultCode {
  /**
   * The EnvironmentState property have been updated.
   */
  'UPDATED' = 200,

  /**
   * The EnvironmentState property have been created.
   */
  'CREATED' = 201,

  /**
   * The EnvironmentState property have been deleted.
   */
  'DELETED' = 204,

  /**
   * The EnvironmentState have been resetted.
   */
  'RESET' = 205,

  /**
   * The provided path is invalid.
   */
  'INVALID_PATH' = 400,

  /**
   * The operation cannot be completed due to functional restrictions.
   */
  'UNPROCESSABLE' = 422,

  /**
   * The store mutation operation thrown an error.
   */
  'STORE_ERROR' = 460
}
