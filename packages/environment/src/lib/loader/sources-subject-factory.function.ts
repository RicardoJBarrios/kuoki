import { ReplaySubject } from 'rxjs';

import { LoaderSource } from '../loader-source';

/**
 * Creates a Map of ReplaySubject attached to LoaderSource ids.
 * @param sources The list of LoaderSources.
 * @returns The Map of subjects attached to LoaderSources.
 */
export function sourcesSubjectFactory(sources: ReadonlyArray<LoaderSource>): Map<string, ReplaySubject<void>> {
  return sources.reduce((map: Map<string, ReplaySubject<void>>, source: LoaderSource) => {
    map.set(source.id, new ReplaySubject());

    return map;
  }, new Map());
}
