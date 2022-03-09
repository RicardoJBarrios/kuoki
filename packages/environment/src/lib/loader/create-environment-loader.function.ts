import { ArrayOrSingle } from 'ts-essentials';

import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { EnvironmentLoader } from './environment-loader.application';

/**
 * Creates an EnvironmentLoader.
 * @param service The environment service.
 * @param sources The sources to get environment properties.
 * @returns An EnvironmentLoader instance.
 */
export function createEnvironmentLoader(
  service: EnvironmentService,
  sources?: ArrayOrSingle<EnvironmentSource>
): EnvironmentLoader {
  return new EnvironmentLoader(service, sources);
}
