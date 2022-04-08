import { GetOptions, Path } from '@kuoki/environment';

import { getOptionsFactory } from '../helpers';
import { EnvironmentModule } from '../module';
import { valueDecoratorFactory } from './value-decorator-factory.function';
import { ValueDecoratorOptions } from './value-decorator-options.type';

/**
 * Gets the value at path from environment as Promise if the property is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function ValueAsync<T>(path: Path, options?: ValueDecoratorOptions<T>): PropertyDecorator;
/**
 * Gets the value at path from environment as Promise if the getter returns undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function ValueAsync<T>(path: Path, options?: ValueDecoratorOptions<T>): MethodDecorator;
export function ValueAsync<T>(
  path: Path,
  options?: ValueDecoratorOptions<Promise<T>>
): PropertyDecorator | MethodDecorator {
  const getOptions: GetOptions<T> = getOptionsFactory<T, ValueDecoratorOptions<Promise<T>>>(options);

  return valueDecoratorFactory<Promise<T>>(() => EnvironmentModule.query?.getAsync<T>(path, getOptions), options);
}
