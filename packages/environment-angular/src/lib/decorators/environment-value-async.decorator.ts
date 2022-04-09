import { GetOptions, Path } from '@kuoki/environment';

import { getOptionsFactory } from '../helpers';
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
  const getOptions: GetOptions<T> = getOptionsFactory<T, EnvironmentValueDecoratorOptions<Promise<T>>>(options);

  return environmentValueDecoratorFactory<Promise<T>>(
    () => EnvironmentModule.query?.getAsync<T>(path, getOptions),
    options
  );
}
