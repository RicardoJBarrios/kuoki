import { Pipe, PipeTransform } from '@angular/core';
import { GetOptionsReactive, NonUndefined, Path, pathAsString, Property } from '@kuoki/environment';
import { map, Observable, of } from 'rxjs';

import { EnvironmentModule } from '../module';

/**
 * Renders the value as Observable from EnvironmentState or the path as Observable if value is undefined.
 */
@Pipe({ name: 'environmentValue$' })
export class EnvironmentValueReactivePipe implements PipeTransform {
  /**
   * Transforms the value as Observable from EnvironmentState or the path as Observable if value is undefined.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param config The options to get a property as Observable.
   * @returns The value as Observable from EnvironmentState or the path as Observable if value is undefined.
   * @see EnvironmentQuery#get$
   */
  transform<T extends NonUndefined<Property>, K = T>(
    path: Path,
    config?: GetOptionsReactive<T, K>
  ): Observable<NonUndefined<T | K> | string> {
    return (
      EnvironmentModule.query
        ?.get$<T, K>(path, config)
        .pipe(map((value?: T | K) => (value !== undefined ? (value as NonUndefined<T | K>) : pathAsString(path)))) ??
      of(pathAsString(path))
    );
  }
}
