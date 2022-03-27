import 'reflect-metadata';

import { GetOptions, Path } from '@kuoki/environment';

import { isPromiseLike } from '../helpers';
import { EnvironmentModule } from '../module';

/**
 * Gets the property with the value at path from environment as Promise if the property value is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value.
 * @throws TypeError if tries to set a non Promise value.
 */
export function ValueAsync<T>(path: Path, options?: GetOptions<T>): PropertyDecorator {
  return (target: object, propertyKey: PropertyKey): void => {
    const metadataKey: unique symbol = Symbol(`environment-value-decorator:${String(propertyKey)}`);

    const descriptor: PropertyDescriptor = {
      get(this: any): any {
        const value: any = Reflect.getMetadata(metadataKey, this);

        return value === undefined ? EnvironmentModule.query?.getAsync(path, options) : value;
      },
      set(this: any, value: any) {
        if (value != null && !isPromiseLike(value)) {
          throw new TypeError(`${String(propertyKey)} must be a PromiseLike`);
        }

        Reflect.defineMetadata(metadataKey, value, this);
      },
      enumerable: true,
      configurable: true
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}
