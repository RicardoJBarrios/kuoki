import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { DefaultEnvironmentLoader } from './environment-loader.application';
import { EnvironmentLoader } from './environment-loader.interface';

/**
 * Creates a default environment loader instance.
 * @param service The EnvironmentService.
 * @param sources The list of EnvironmentSources.
 * @returns A default environment loader instance.
 */
export function createEnvironmentLoader(
  service: EnvironmentService,
  sources?: ArrayOrSingle<EnvironmentSource>
): EnvironmentLoader {
  return new DefaultEnvironmentLoader(service, sources);
}
