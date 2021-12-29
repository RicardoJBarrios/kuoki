import { get } from 'lodash-es';

import { Environment } from '../store';

/**
 * Check if the path contains a value that doesn't allow to create the property without overwriting it.
 * @param path The path to check.
 * @param environment The environment to check.
 * @returns `true` if the path contains overwriten values, otherwise `false`.
 */
export function isOverwritingAPathValue(path: string[], environment: Environment): boolean {
  if (path.length === 0) {
    return false;
  }

  const innerPath = [...path];
  const value = get(environment, innerPath);

  if (typeof value === 'object' || value === undefined) {
    if (innerPath.length === 1) {
      return false;
    }

    innerPath.pop();

    return isOverwritingAPathValue(innerPath, environment);
  }

  return true;
}
