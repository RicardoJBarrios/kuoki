import { Path } from '../path';
import { Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';

/**
 * An environment service operation result.
 * @template RESULT_CODE The sresult code used by the implementation.
 * @see {@link EnvironmentResultCode}
 */
export interface EnvironmentResult<RESULT_CODE extends EnvironmentResultCode = EnvironmentResultCode> {
  /**
   * The result code. Based on HTTP response status codes.
   * @see {@link EnvironmentResultCode}
   */
  code: RESULT_CODE;
  /**
   * The path used in the method.
   */
  path?: Path;
  /**
   * The value used in the method.
   * @see {@link Property}
   */
  value?: Property;
  /**
   * The error returned.
   */
  error?: Error;
}
