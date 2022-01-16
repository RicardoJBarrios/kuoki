import { assignInWith } from 'lodash-es';
import { ArrayOrSingle } from 'ts-essentials';
import { v4 } from 'uuid';

import { EnvironmentSource } from '../source';

/**
 * @internal
 */
export function environmentSourcesFactory(sources?: ArrayOrSingle<EnvironmentSource>): Required<EnvironmentSource>[] {
  if (sources == null) {
    return [];
  }

  const sourcesArray: EnvironmentSource[] = Array.isArray(sources) ? sources : [sources];

  return sourcesArray
    .filter((source: EnvironmentSource) => source != null)
    .map((source: EnvironmentSource) => environmentSourceFactory(source));
}

/**
 * @internal
 */
function environmentSourceFactory(source: EnvironmentSource): Required<EnvironmentSource> {
  const defaultValues: Partial<EnvironmentSource> = {
    id: v4(),
    requiredToLoad: false,
    loadInOrder: false,
    mergeProperties: false,
    ignoreError: false,
  };

  return assignInWith(source, defaultValues, <T>(sourceValue: T | undefined, defaultValue: T) =>
    sourceValue === undefined ? defaultValue : sourceValue,
  ) as Required<EnvironmentSource>;
}
