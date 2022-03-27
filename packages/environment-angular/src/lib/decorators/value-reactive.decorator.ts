import 'reflect-metadata';

import { GetOptions, Path } from '@kuoki/environment';
import { Observable } from 'rxjs';

import { EnvironmentModule } from '../module';

/**
 * Gets the property with the value at path from environment as Observable if the property value is undefined.
 * @param path The environment path to resolve.
 * @param options The options to get the value.
 * @throws TypeError if tries to set a non Observable value.
 */
export function Value$<T>(path: Path, options?: GetOptions<T>): PropertyDecorator {
  return (target: object, propertyKey: PropertyKey): void => {
    const metadataKey: unique symbol = Symbol(`environment-value-decorator:${String(propertyKey)}`);

    const descriptor: PropertyDescriptor = {
      get(this: any): any {
        const value: any = Reflect.getMetadata(metadataKey, this);

        return value === undefined ? EnvironmentModule.query?.get$(path, options) : value;
      },
      set(this: any, value: any) {
        if (value != null && !(value instanceof Observable)) {
          throw new TypeError(`${String(propertyKey)} must be an Observable`);
        }

        Reflect.defineMetadata(metadataKey, value, this);
      },
      enumerable: true,
      configurable: true
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}
