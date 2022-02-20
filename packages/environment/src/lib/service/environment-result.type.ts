import { Path } from '../path';
import { Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';

/**
 * An environment service operation result.
 * @see {@link EnvironmentService}
 */
export interface EnvironmentResult<RESULT_CODE extends EnvironmentResultCode = EnvironmentResultCode> {
  /**
   * The result code. Based on HTTP response status codes.
   */
  code: RESULT_CODE;
  /**
   * The path used in the method.
   */
  path?: Path;
  /**
   * The value used in the method.
   */
  value?: Property;
  /**
   * The error returned.
   */
  error?: Error;
}
