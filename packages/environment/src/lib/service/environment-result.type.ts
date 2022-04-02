import { Path } from '../path';
import { Property } from '../store';
import { EnvironmentResultCode } from './environment-result-code.enum';

/**
 * An environment service operation result.
 */
export interface EnvironmentResult {
  /**
   * The result code.
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
  /**
   * The error returned.
   */
  error?: Error;
}
