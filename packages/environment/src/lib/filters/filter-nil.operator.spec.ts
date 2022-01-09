import { marbles } from 'rxjs-marbles/jest';
import { TestObservableLike } from 'rxjs-marbles/types';

import { filterNil } from './filter-nil.operator';

describe('filterNil()', () => {
  it(
    `emits items from the source Observable that are not null or undefined`,
    marbles((m) => {
      const values = { a: 0, b: null, c: undefined, d: false };
      const source = m.cold('-a-b-c-d-', values);
      const expected = m.cold('-a-----d-', values);
      m.expect(source.pipe(filterNil())).toBeObservable(expected as TestObservableLike<any>);
    }),
  );
});
