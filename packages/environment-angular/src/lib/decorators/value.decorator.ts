import { GetOptions, Path } from '@kuoki/environment';

import { EnvironmentModule } from '../module';

/**
 * Sets the property with the value at path from environment.
 * @param path The environment path to resolve.
 * @param options The options to get the value.
 */
export function Value<T>(path: Path, options?: GetOptions<T>) {
  return function (target: object, key: PropertyKey) {
    let value: T | undefined;

    const getter = () => {
      if (value === undefined) {
        value = EnvironmentModule.query?.get(path, options);
      }

      return value;
    };

    const setter = (newValue: T) => {
      value = newValue;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}
