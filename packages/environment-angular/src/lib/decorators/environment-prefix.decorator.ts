import 'reflect-metadata';

import { isPath, Path } from '@kuoki/environment';

/* eslint-disable @typescript-eslint/ban-types */

export const ENVIRONMENT_PREFIX_METADATA_KEY: symbol = Symbol.for(`environment-prefix`);

/**
 * Sets a base path for the class used by the other decorators.
 * @param path The EnvironmentState path to resolve.
 * @returns A class decorator to set a base path for the class used by the other decorators.
 */
export function EnvironmentPrefix(path: Path): ClassDecorator {
  return <TFunction extends Function>(target: TFunction): TFunction | void => {
    if (isPath(path)) {
      Reflect.defineMetadata(ENVIRONMENT_PREFIX_METADATA_KEY, path, target);
    }
  };
}
