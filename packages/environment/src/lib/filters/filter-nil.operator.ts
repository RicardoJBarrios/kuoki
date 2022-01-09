import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Filter items emitted by the source Observable by only emitting those that are not null or undefined.
 * @typeParam T The type of the emitted value by the source Observable.
 * @returns An Observable that emits items from the source Observable that are not null or undefined.
 * @see {@link Observable}
 * @example
 * ```js
 * // observable = -null-undefined-0-1-2-
 * observable.pipe(filterNil()).subscribe(); // -----0-1-2-
 * ```
 */
export function filterNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return filter((value: T): value is NonNullable<T> => value != null);
}
