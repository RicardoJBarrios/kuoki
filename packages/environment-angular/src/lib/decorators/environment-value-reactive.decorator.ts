import { GetOptionsObs, Path, Property } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { environmentValueDecoratorFactory } from './environment-value-decorator-factory.function';
import { GetOptionsDecorator } from './get-options-decorator.type';

/**
 * Gets the value at path from environment as Observable if the property is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValue$<T extends Property, K = T>(
  path: Path,
  options?: GetOptionsObs<T, K> & GetOptionsDecorator
): PropertyDecorator;

/**
 * Gets the value at path from environment as Observable if the getter returns undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value and set the property.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function EnvironmentValue$<T extends Property, K = T>(
  path: Path,
  options?: GetOptionsObs<T, K> & GetOptionsDecorator
): MethodDecorator;

export function EnvironmentValue$<T extends Property, K = T>(
  path: Path,
  options?: GetOptionsObs<T, K> & GetOptionsDecorator
): PropertyDecorator | MethodDecorator {
  return environmentValueDecoratorFactory({
    getEnvironmentValueFn: (_path: Path, _options: GetOptionsObs<T, K>) =>
      EnvironmentModule.query?.get$(_path, _options),
    path,
    options
  });
}
