import { Path } from '../path';
import { Property } from '../store';

/**
 * An {@link EnvironmentService} method result.
 */
export interface EnvironmentResult {
  /**
   * The result code. Based on HTTP response status codes.
   */
  code: number;
  /**
   * The path used in the method.
   */
  path?: Path;
  /**
   * The value used in the method.
   */
  value?: Property;
}
