import { Path } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { valueDecoratorFactory } from './value-decorator-factory.function';
import { ValueDecoratorOptions } from './value-decorator-options.type';

/**
 * Gets the value at path from environment if the property is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function Value<T>(path: Path, options?: ValueDecoratorOptions<T>): PropertyDecorator;
/**
 * Gets the value at path from environment if the getter returns undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function Value<T>(path: Path, options?: ValueDecoratorOptions<T>): MethodDecorator;
export function Value<T>(path: Path, options?: ValueDecoratorOptions<T>): PropertyDecorator | MethodDecorator {
  return valueDecoratorFactory(() => EnvironmentModule.query?.get(path, options), options);
}
