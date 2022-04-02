import { ifDefined } from '../helpers';
import { isPath } from '../path';
import { EnvironmentSource } from './environment-source.gateway';
import { SourceStrategy } from './source-strategy.enum';

/**
 * Checks if the value is a valid environment source.
 * @param value The value to check.
 * @returns `true` if the value is a valid environment source, otherwise `false`.
 */
export function isEnvironmentSource(value: any): value is EnvironmentSource {
  const checks: boolean[] = [
    typeof value?.load === 'function',
    ifDefined(value?.id, typeof value?.id === 'string'),
    ifDefined(value?.isRequired, typeof value?.isRequired === 'boolean'),
    ifDefined(value?.isOrdered, typeof value?.isOrdered === 'boolean'),
    ifDefined(value?.ignoreError, typeof value?.ignoreError === 'boolean'),
    ifDefined(value?.strategy, Object.values(SourceStrategy).includes(value?.strategy)),
    ifDefined(value?.path, isPath(value?.path)),
    ifDefined(value?.mapFn, typeof value?.mapFn === 'function'),
    ifDefined(value?.errorHandler, typeof value?.errorHandler === 'function')
  ];

  return checks.every((check: boolean) => check);
}
