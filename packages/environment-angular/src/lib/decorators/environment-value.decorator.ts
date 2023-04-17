import { GetOptions, NonUndefined, Path, Property } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { environmentValueDecoratorFactory } from './environment-value-decorator-factory.function';
import { GetOptionsDecorator } from './get-options-decorator.type';

/**
 * Gets the synchronous value at path from environment if the property is undefined.
 * @param path The EnvironmentState path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValue<T extends NonUndefined<Property>, K = T>(
  path: Path,
  options?: GetOptions<T, K> & GetOptionsDecorator
): PropertyDecorator;

/**
 * Gets the synchronous value at path from environment if the getter returns undefined.
 * @param path The EnvironmentState path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValue<T extends NonUndefined<Property>, K = T>(
  path: Path,
  options?: GetOptions<T, K> & GetOptionsDecorator
): MethodDecorator;

export function EnvironmentValue<T extends NonUndefined<Property>, K = T>(
  path: Path,
  options?: GetOptions<T, K> & GetOptionsDecorator
): PropertyDecorator | MethodDecorator {
  return environmentValueDecoratorFactory({
    getEnvironmentValueFn: (_path: Path, _options: GetOptions<T, K>) => EnvironmentModule.query?.get(_path, _options),
    path,
    options
  });
}
