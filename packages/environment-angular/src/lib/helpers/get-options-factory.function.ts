import { GetOptions, GetOptionsAll, GetOptionsAsync, Property } from '@kuoki/environment';
import { pickBy } from 'lodash-es';

export function getOptionsFactory<T extends Property, K>(options?: GetOptionsAll<T, K>): GetOptionsAll<T, K> {
  if (options == null) {
    return {} as GetOptionsAll<T, K>;
  }

  const getOptions: Record<string, unknown> = {
    defaultValue: options.defaultValue,
    targetType: options.targetType,
    transpile: options.transpile,
    config: options.config
  };

  if ('required' in options) {
    return defined({ ...getOptions, required: options.required }) as GetOptions<T, K>;
  }

  if ('dueTime' in options) {
    return defined({ ...getOptions, dueTime: options.dueTime }) as GetOptionsAsync<T, K>;
  }

  return defined(getOptions) as GetOptionsAll<T, K>;
}

function defined(obj: Record<string, unknown>): Record<string, unknown> {
  return pickBy(obj, (v) => v !== undefined);
}
