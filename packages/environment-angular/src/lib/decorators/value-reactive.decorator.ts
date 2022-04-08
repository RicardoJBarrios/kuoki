import { GetOptions, Path } from '@kuoki/environment';
import { Observable } from 'rxjs';

import { getOptionsFactory } from '../helpers';
import { EnvironmentModule } from '../module';
import { valueDecoratorFactory } from './value-decorator-factory.function';
import { ValueDecoratorOptions } from './value-decorator-options.type';

/**
 * Gets the value at path from environment as Observable if the property is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function Value$<T>(path: Path, options?: ValueDecoratorOptions<T>): PropertyDecorator;
/**
 * Gets the value at path from environment as Observable if the getter returns undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function Value$<T>(path: Path, options?: ValueDecoratorOptions<T>): MethodDecorator;
export function Value$<T>(
  path: Path,
  options?: ValueDecoratorOptions<Observable<T>>
): PropertyDecorator | MethodDecorator {
  const getOptions: GetOptions<T> = getOptionsFactory<T, ValueDecoratorOptions<Observable<T>>>(options);

  return valueDecoratorFactory<Observable<T>>(() => EnvironmentModule.query?.get$<T>(path, getOptions), options);
}
