import { GetOptions, GetOptionsAll, GetOptionsAsync, GetOptionsObs, Property } from '@kuoki/environment';

export function getOptionsFactory<T extends Property, K>(options?: GetOptionsAll<T, K>): GetOptionsAll<T, K> {
  if (options == null) {
    return {} as GetOptionsObs<T, K>;
  }

  const getOptions: GetOptionsObs<T, K> = {
    defaultValue: options?.defaultValue,
    targetType: options?.targetType,
    transpile: options?.transpile,
    config: options?.config
  };

  if ('dueTime' in options != null) {
    const dueTime = (options as GetOptionsAsync<T, K>).dueTime;
    return { ...getOptions, dueTime } as GetOptionsAsync<T, K>;
  }

  if ('required' in options != null) {
    const required = (options as GetOptions<T, K>).required;
    return { ...getOptions, required } as GetOptions<T, K>;
  }

  return getOptions;
}
