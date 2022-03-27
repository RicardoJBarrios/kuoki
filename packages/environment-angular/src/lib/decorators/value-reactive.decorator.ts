import 'reflect-metadata';

import { GetOptions, Path } from '@kuoki/environment';
import { Observable } from 'rxjs';

import { EnvironmentModule } from '../module';

/**
 * Sets the property with the value at path from environment as Observable.
 * @param path The environment path to resolve.
 * @param options The options to get the value.
 */
export function Value$<T>(path: Path, options?: GetOptions<T>): PropertyDecorator {
  return (target: object, propertyKey: string | symbol): void => {
    const metadataKey: unique symbol = Symbol(`environment-value$-decorator:${String(propertyKey)}`);

    const descriptor: PropertyDescriptor = {
      get(this: any) {
        let value: any = Reflect.getMetadata(metadataKey, this);

        if (value === undefined) {
          value = EnvironmentModule.query?.get$(path, options);

          if (value !== undefined) {
            Reflect.defineMetadata(metadataKey, value, this);
          }
        }

        return value;
      },
      set(this: any, value: Observable<T | undefined>) {
        Reflect.defineMetadata(metadataKey, value, this);
      },
      enumerable: true,
      configurable: true
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}
