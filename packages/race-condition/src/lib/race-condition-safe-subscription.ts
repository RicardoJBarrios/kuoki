import { isEqual } from 'lodash-es';
import { Subscription } from 'rxjs';

interface RaceConditionSafeSubscribe {
  readonly subscription: Subscription;
  readonly args?: unknown[];
}

/**
 * A function that returns a `Subscription`.
 */
export type SubscriptionFn = () => Subscription;

/**
 * Avoid race conditions when store disposable resources, such as the execution of an Observable.
 */
export class RaceConditionSafeSubscription {
  private readonly _safeSubscriptions: Map<PropertyKey, RaceConditionSafeSubscribe> = new Map();

  /**
   * Creates a race condition safe disposable resource, such as the execution of an Observable
   * associated with a `key` that will be unsubscribed before subscribing again if the `key` and `args`
   * are used again or the subscription is closed.
   * @param key The unique key associated to the Subscription.
   * @param subscriptionFn A function that returns a disposable resource, such as the execution of an Observable.
   * @param [args] Arguments required to create the disposable resource.
   */
  add(key: string, subscriptionFn: SubscriptionFn, ...args: unknown[]) {
    const safeSubscription: RaceConditionSafeSubscribe | undefined = this._safeSubscriptions.get(key);

    if (!this.isActiveSubscription(safeSubscription, ...args)) {
      safeSubscription?.subscription.unsubscribe();
      this._safeSubscriptions.set(key, { subscription: subscriptionFn(), args });
    }
  }

  protected isActiveSubscription(safeSubscription?: RaceConditionSafeSubscribe, ...args: unknown[]): boolean {
    return safeSubscription != null && !safeSubscription.subscription.closed && isEqual(safeSubscription.args, args);
  }

  /**
   * Gets a disposable resource, such as the execution of an Observable, associated with the `key`
   * or undefined if the key does not exist.
   * @param key The unique key associated to the Subscription.
   * @returns A disposable resource, such as the execution of an Observable, or undefined if the key does not exist.
   */
  get(key: string): Subscription | undefined {
    const safeSubscribe: RaceConditionSafeSubscribe | undefined = this._safeSubscriptions.get(key);
    return safeSubscribe != null ? safeSubscribe.subscription : undefined;
  }

  /**
   * Disposes the resource held by the safe subscriptions associated with the `keys`
   * or all the resources if a key is not provided.
   * @param [keys] The list of keys associated to the Subscriptions.
   */
  unsubscribe(...keys: string[]) {
    if (keys.length === 0) {
      this._unsubscribeAll();
    } else {
      keys.forEach((key: string) => {
        this._unsubscribeKey(key);
      });
    }
  }

  private _unsubscribeAll() {
    this._safeSubscriptions.forEach((safeSubscribable: RaceConditionSafeSubscribe, key: PropertyKey) => {
      safeSubscribable.subscription.unsubscribe();
      this._safeSubscriptions.delete(key);
    });
  }

  private _unsubscribeKey(key: string) {
    const subscription: Subscription | undefined = this.get(key);

    if (subscription != null) {
      subscription.unsubscribe();
      this._safeSubscriptions.delete(key);
    }
  }
}
