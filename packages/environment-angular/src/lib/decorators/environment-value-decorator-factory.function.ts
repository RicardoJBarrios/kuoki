import 'reflect-metadata';

import { GetOptionsAll, NonUndefined, Path, prefixPath, Property } from '@kuoki/environment';
import { Observable } from 'rxjs';
import { Newable } from 'ts-essentials';

import { getOptionsFactory } from '../helpers';
import { ENVIRONMENT_PREFIX_METADATA_KEY } from './environment-prefix.decorator';
import { GetOptionsDecorator } from './get-options-decorator.type';

export type EnvironmentValueDecoratorMethodReturn<T> = T | Observable<T | unknown> | Promise<T | unknown> | unknown;

export function environmentValueDecoratorFactory<T extends NonUndefined<Property>, K = T>({
  getEnvironmentValueFn,
  path,
  options
}: {
  getEnvironmentValueFn: (path: Path, options: GetOptionsAll<T, K>) => EnvironmentValueDecoratorMethodReturn<T>;
  path: Path;
  options?: GetOptionsAll<T, K> & GetOptionsDecorator;
}): PropertyDecorator | MethodDecorator {
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
        const getOptions: GetOptionsAll<T, K> = getOptionsFactory<T, K>(options);
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
