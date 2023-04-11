import { get } from 'lodash-es';

import { EnvironmentState } from '../store';
import { isPath } from './is-path.function';
import { Path } from './path.type';
import { pathAsArray } from './path-as-array.function';

/**
 * Checks is the path overwrites a value in the environment.
 * @param path The path to check.
 * @param state The environment state to check.
 * @returns `true` if the path overwrites a value in the environment, otherwise `false`.
 */
export function overwritesPath(path: Path, state: EnvironmentState): boolean {
  if (!isPath(path)) {
    return false;
  }

  const value = get(state, path);

  if (typeof value === 'object' || value == null) {
    const innerPath: string[] = [...pathAsArray(path)];

    if (innerPath.length === 1) {
      return false;
    }

    innerPath.pop();

    return overwritesPath(innerPath, state);
  }

  return true;
}
