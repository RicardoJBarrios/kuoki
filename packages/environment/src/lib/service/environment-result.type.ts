import { Path } from '../path';
import { Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';

/**
 * An {@link EnvironmentService} method result.
 */
export interface EnvironmentResult {
  /**
   * The result code. Based on HTTP response status codes.
   */
  code: EnvironmentResultCode;
  /**
   * The path used in the method.
   */
  path?: Path;
  /**
   * The value used in the method.
   */
  value?: Property;
}
