import { ReplaySubject } from 'rxjs';

import { SourceStrategy } from '../source';
import { LoaderSource } from './loader-source.type';
import { sourcesSubjectFactory } from './sources-subject-factory.function';

const source1: LoaderSource = {
  id: 'a',
  isRequired: true,
  isOrdered: true,
  ignoreError: true,
  strategy: SourceStrategy.ADD,
  load: () => [{ a: 0 }]
};

const source2: LoaderSource = {
  id: 'b',
  isRequired: true,
  isOrdered: true,
  ignoreError: true,
  strategy: SourceStrategy.ADD,
  load: () => [{ b: 0 }]
};

describe('sourcesSubjectFactory(sources)', () => {
  it(`returns a map without sources`, () => {
    expect(sourcesSubjectFactory([])).toEqual(new Map());
  });

  it(`returns a map with the sources id and a ReplaySubject`, () => {
    const map = sourcesSubjectFactory([source1, source2]);
    expect(map.size).toEqual(2);
    expect(map.get('a')).toBeInstanceOf(ReplaySubject);
    expect(map.get('b')).toBeInstanceOf(ReplaySubject);
  });
});
