import { GetOptions } from '@kuoki/environment';

export function getOptionsFactory<T, K extends GetOptions<any>>(options?: K): GetOptions<T> {
  return {
    defaultValue: options?.defaultValue,
    targetType: options?.targetType,
    transpile: options?.transpile,
    config: options?.config,
    dueTime: options?.dueTime
  };
}
