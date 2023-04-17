import { GetOptions, GetOptionsAll, GetOptionsAsync, NonUndefined, Property } from '@kuoki/environment';
import { pickBy } from 'lodash-es';

/**
 * A factory to create the GetOptionsAll object.
 * @param options the original GetOptionsAll.
 * @returns A safe GetOptionsAll.
 */
export function getOptionsFactory<T extends NonUndefined<Property>, K>(
  options?: GetOptionsAll<T, K>
): GetOptionsAll<T, K> {
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
