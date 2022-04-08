import 'reflect-metadata';

import { Observable } from 'rxjs';
import { Newable } from 'ts-essentials';

import { ValueDecoratorOptions } from './value-decorator-options.type';

export type ValueDecoratorMethodReturn<T> = T | Observable<T | unknown> | Promise<T | unknown> | unknown;

export function valueDecoratorFactory<T>(
  method: () => ValueDecoratorMethodReturn<T>,
  options?: ValueDecoratorOptions<T>
): PropertyDecorator | MethodDecorator {
  return (
    target: object,
    propertyKey: PropertyKey,
    descriptor?: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void => {
    if (descriptor?.value != null) {
      return descriptor;
    }

    const metadataKey: symbol = Symbol.for(`environment-value-decorator:${String(propertyKey)}`);

    const localDescriptor: TypedPropertyDescriptor<T> =
      descriptor != null
        ? descriptor
        : {
            enumerable: options?.enumerable ?? true,
            configurable: options?.configurable ?? true
          };

    localDescriptor.get = function <THIS extends Newable<object>>(this: THIS): T {
      let value: unknown = Reflect.getMetadata(metadataKey, this);

      if (value === undefined) {
        value = method();

        if (options?.static !== false) {
          Reflect.defineMetadata(metadataKey, value, this);
        }
      }

      return value as T;
    };

    localDescriptor.set = function <THIS extends Newable<object>>(this: THIS, value: T) {
      Reflect.defineMetadata(metadataKey, value, this);
    };

    Object.defineProperty(target, propertyKey, localDescriptor);
  };
}
