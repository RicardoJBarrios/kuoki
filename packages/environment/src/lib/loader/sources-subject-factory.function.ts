import { ReplaySubject } from 'rxjs';

import { LoaderSource } from './loader-source.type';

/**
 * Creates a Map of ReplaySubject attached to loader source ids.
 * @template LOADER_SOURCE a LoaderSource or extension.
 * @param sources The list of loader sources.
 * @returns The Map of subjects attached to sources.
 */
export function sourcesSubjectFactory<LOADER_SOURCE extends LoaderSource = LoaderSource>(
  sources: ReadonlyArray<LOADER_SOURCE>
): Map<string, ReplaySubject<void>> {
  return sources.reduce((map: Map<string, ReplaySubject<void>>, source: LOADER_SOURCE) => {
    map.set(source.id, new ReplaySubject());

    return map;
  }, new Map());
}
