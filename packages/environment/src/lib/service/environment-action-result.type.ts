import { Path } from '../shared';
import { Property } from '../store';

/**
 * An {@link EnvironmentService} action result.
 */
export interface EnvironmentActionResult {
  /**
   * The action result code. Based on HTTP response status codes.
   */
  code: number;
  /**
   * The path used in the action.
   */
  path?: Path;
  /**
   * The value used in the action.
   */
  value?: Property;
}
