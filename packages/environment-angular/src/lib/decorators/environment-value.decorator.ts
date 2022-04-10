import { GetOptions, Path } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { environmentValueDecoratorFactory } from './environment-value-decorator-factory.function';
import { EnvironmentValueDecoratorOptions } from './environment-value-decorator-options.type';

/**
 * Gets the value at path from environment if the property is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValue<T>(path: Path, options?: EnvironmentValueDecoratorOptions<T>): PropertyDecorator;
/**
 * Gets the value at path from environment if the getter returns undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValue<T>(path: Path, options?: EnvironmentValueDecoratorOptions<T>): MethodDecorator;
export function EnvironmentValue<T>(
  path: Path,
  options?: EnvironmentValueDecoratorOptions<T>
): PropertyDecorator | MethodDecorator {
  return environmentValueDecoratorFactory(
    (_path: Path, _options: GetOptions<T>) => EnvironmentModule.query?.get(_path, _options),
    path,
    options
  );
}
