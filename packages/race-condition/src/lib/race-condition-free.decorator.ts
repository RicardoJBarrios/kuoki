import { Subscription } from 'rxjs';

import { RaceConditionFreeSubscription } from './race-condition-free-subscription';

/**
 * Avoid race conditions when store disposable resources, such as the execution of an Observable.
 */
export function RaceConditionFree(): MethodDecorator {
  return (_target: object, propertyKey: PropertyKey, descriptor?: PropertyDescriptor) => {
    const originalMethod = descriptor?.value;

    if (descriptor != null && originalMethod != null) {
      const subscription: RaceConditionFreeSubscription = new RaceConditionFreeSubscription();
      const key = String(propertyKey);

      descriptor.value = (...args: unknown[]) => {
        const result: unknown = originalMethod(...args);

        if (result instanceof Subscription) {
          subscription.add(key, () => result, ...args);
        }

        return result;
      };
    }

    return descriptor;
  };
}
