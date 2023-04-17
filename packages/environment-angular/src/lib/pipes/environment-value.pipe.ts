import { Pipe, PipeTransform } from '@angular/core';
import { GetOptions, NonUndefined, Path, pathAsString, Property } from '@kuoki/environment';

import { EnvironmentModule } from '../module';

/**
 * Renders the value from EnvironmentState or the path if value is undefined.
 */
@Pipe({ name: 'envValue' })
export class EnvironmentValuePipe implements PipeTransform {
  /**
   * Transforms the value from EnvironmentState or the path if value is undefined.
   * @template T The EnvironmentState property type.
   * @template K The expected property target type.
   * @param path The EnvironmentState path to resolve.
   * @param config The options to get a property.
   * @returns The value from EnvironmentState or the path if value is undefined.
   * @see EnvironmentQuery#get
   */
  transform<T extends NonUndefined<Property>, K = T>(
    path: Path,
    config?: GetOptions<T, K>
  ): NonUndefined<T | K> | string {
    const value: T | K | undefined = EnvironmentModule.query?.get<T, K>(path, config);

    return value !== undefined ? (value as NonUndefined<T | K>) : pathAsString(path);
  }
}
