import { defer, firstValueFrom, Observable, ObservableInput, OperatorFunction, timeout } from 'rxjs';

import { filterNil } from './filter-nil.operator';

/**
 * Gets the first not null or undefined value as Promise from a sequence or async source.
 * @typeParam T The type of the secuence or async source value.
 * @param source The secuence or async source.
 * @param due Number specifying period in miliseconds within which source must resolve the value
 * or Date specifying before when Promise should complete.
 * @returns A Promise with the first not null or undefined value.
 * If `due` is setted and the Promise is not resolved in given time span the Promise will be rejected with a [TimeoutError](https://rxjs.dev/api/index/interface/TimeoutError).
 * If there are no elements in sequence the Promise will be rejected with an [EmptyError](https://rxjs.dev/api/index/interface/EmptyError).
 * @example
 * ```js
 * // observable = -null-undefined-0-1-2-
 * asyncNotNil(Promise.resolves(0)); // Promise resolves 0
 * asyncNotNil([null, undefined, 0, 1, 2]); // Promise resolves 0
 * asyncNotNil(observable); // Promise resolves 0
 * asyncNotNil(observable, 100); // Promise resolves 0
 * asyncNotNil(observable, 1); // Promise rejects TimeoutError
 * asyncNotNil([null, undefined]); // Promise rejects EmptyError
 * ```
 */
export function asyncNotNil<T>(source: ObservableInput<T>, due?: number | Date): Promise<NonNullable<T>> {
  const observable: Observable<NonNullable<T>> = defer(() => source).pipe(notNilDueOperator(due));

  return firstValueFrom(observable);
}

/**
 * @internal
 */
function notNilDueOperator<T>(due?: number | Date): OperatorFunction<T, NonNullable<T>> {
  return (observable: Observable<T>) =>
    due == null ? observable.pipe(filterNil()) : observable.pipe(filterNil(), timeout({ first: due }));
}
