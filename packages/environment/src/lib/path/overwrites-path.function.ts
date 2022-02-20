import { get } from 'lodash-es';

import { EnvironmentState } from '../store';
import { isPath } from './is-path.function';
import { pathAsArray } from './path-as-array.function';
import { Path } from './path.type';

/**
 * Checks is the path overwrites a value in the environment.
 * @param path The path to check.
 * @param state The environment state to check.
 * @returns `true` if the path overwrites a value in the environment, otherwise `false`.
 * @example
 * ```js
 * // EnvironmentState = { a: { a: {}, b: 0 } }
 * overwritesPath('a.b'); // true
 * overwritesPath('a.b.a'); // true
 * overwritesPath('a'); // false
 * overwritesPath('a.a'); // false
 * overwritesPath('a.a.a'); // false
 * ```
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
