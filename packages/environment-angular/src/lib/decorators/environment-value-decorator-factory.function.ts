import 'reflect-metadata';

import { GetOptions, Path, prefixPath } from '@kuoki/environment';
import { Observable } from 'rxjs';
import { Newable } from 'ts-essentials';

import { getOptionsFactory } from '../helpers';
import { ENVIRONMENT_PREFIX_METADATA_KEY } from './environment-prefix.decorator';
import { EnvironmentValueDecoratorOptions } from './environment-value-decorator-options.type';

export type EnvironmentValueDecoratorMethodReturn<T> = T | Observable<T | unknown> | Promise<T | unknown> | unknown;

export function environmentValueDecoratorFactory<T>(
  getEnvironmentValueFn: (path: Path, options: GetOptions<T>) => EnvironmentValueDecoratorMethodReturn<T>,
  path: Path,
  options?: EnvironmentValueDecoratorOptions<T>
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
            enumerable: true,
            configurable: true
          };

    localDescriptor.get = function <THIS extends Newable<object>>(this: THIS): T {
      let value: unknown = Reflect.getMetadata(metadataKey, this);

      if (value === undefined) {
        const prefixDecorator: Path | undefined = Reflect.getMetadata(
          ENVIRONMENT_PREFIX_METADATA_KEY,
          target.constructor
        );
        const localPath: Path = prefixDecorator != null ? prefixPath(path, prefixDecorator) : path;
        const getOptions: GetOptions<T> = getOptionsFactory<T, EnvironmentValueDecoratorOptions<unknown>>(options);
        value = getEnvironmentValueFn(localPath, getOptions);

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
