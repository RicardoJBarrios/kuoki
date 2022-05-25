import { Subscription } from 'rxjs';

/**
 * An object to store a race subscription subscription.
 */
export interface RaceConditionFreeSubscribe {
  /**
   * Represents a disposable resource, such as the execution of an Observable.
   */
  readonly subscription: Subscription;

  /**
   * Arguments required to create the disposable resource.
   */
  readonly args?: unknown[];
}
