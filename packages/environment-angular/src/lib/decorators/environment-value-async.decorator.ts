import { GetOptions, Path } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { environmentValueDecoratorFactory } from './environment-value-decorator-factory.function';
import { EnvironmentValueDecoratorOptions } from './environment-value-decorator-options.type';

/**
 * Gets the value at path from environment as Promise if the property is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValueAsync<T>(path: Path, options?: EnvironmentValueDecoratorOptions<T>): PropertyDecorator;
/**
 * Gets the value at path from environment as Promise if the getter returns undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValueAsync<T>(path: Path, options?: EnvironmentValueDecoratorOptions<T>): MethodDecorator;
export function EnvironmentValueAsync<T>(
  path: Path,
  options?: EnvironmentValueDecoratorOptions<Promise<T>>
): PropertyDecorator | MethodDecorator {
  return environmentValueDecoratorFactory(
    (_path: Path, _options: GetOptions<Promise<T>>) => EnvironmentModule.query?.getAsync(_path, _options),
    path,
    options
  );
}
