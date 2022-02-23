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
    value?.id != null ? typeof value.id === 'string' : true,
    value?.isRequired != null ? typeof value.isRequired === 'boolean' : true,
    value?.isOrdered != null ? typeof value.isOrdered === 'boolean' : true,
    value?.ignoreError != null ? typeof value.ignoreError === 'boolean' : true,
    value?.strategy != null ? Object.values(SourceStrategy).includes(value.strategy) : true,
    value?.path != null ? isPath(value.path) : true,
    typeof value?.load === 'function'
  ];

  return checks.every((isCorrect: boolean) => isCorrect);
}
