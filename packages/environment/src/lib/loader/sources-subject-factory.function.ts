import { ReplaySubject } from 'rxjs';

import { LoaderSource } from './loader-source.type';

/**
 * Creates a Map of ReplaySubject attached to loader sources id.
 * @param sources The list of loader sources.
 * @returns The Map of subjects attached to sources.
 */
export function sourcesSubjectFactory(sources: ReadonlyArray<LoaderSource>): Map<string, ReplaySubject<void>> {
  return sources.reduce((map: Map<string, ReplaySubject<void>>, source: LoaderSource) => {
    map.set(source.id, new ReplaySubject());

    return map;
  }, new Map());
}
