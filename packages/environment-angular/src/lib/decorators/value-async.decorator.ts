import 'reflect-metadata';

import { Path } from '@kuoki/environment';

import { EnvironmentModule } from '../module';
import { ValueDecoratorOptions } from './value-decorator-options.type';

/**
 * Gets the property with the value at path from environment as Promise if the property value is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value.
 * @returns A property decorator to get the property with the value at path from environment.
 */
export function ValueAsync<T>(path: Path, options?: ValueDecoratorOptions<T>): PropertyDecorator {
  return (target: object, propertyKey: PropertyKey): void => {
    const metadataKey: symbol = Symbol.for(`environment-value-decorator:${String(propertyKey)}`);

    const descriptor: PropertyDescriptor = {
      get(this: any): any {
        let value: any = Reflect.getMetadata(metadataKey, this);

        if (value === undefined) {
          value = EnvironmentModule.query?.getAsync<T>(path, options);

          if (options?.static !== false) {
            Reflect.defineMetadata(metadataKey, value, this);
          }
        }

        return value;
      },
      set(this: any, value: any) {
        Reflect.defineMetadata(metadataKey, value, this);
      },
      enumerable: true,
      configurable: true
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}
