import { interval, Subscription } from 'rxjs';

import { RaceConditionFreeSubscription } from './race-condition-free-subscription';

const subscriptionFn: () => Subscription = () => interval(10).subscribe();

describe('RaceConditionFreeSubscription', () => {
  let subscription: RaceConditionFreeSubscription;

  beforeEach(() => {
    subscription = new RaceConditionFreeSubscription();
  });

  it(`#add(key, subscriptionFn) adds if new key`, () => {
    expect(subscription['_safeSubscriptions'].get('a')).toBeUndefined();
    subscription.add('a', subscriptionFn);
    expect(subscription['_safeSubscriptions'].get('a')).toBeDefined();
  });

  it(`#add(key, subscriptionFn) subscribes if new key`, () => {
    subscription.add('a', subscriptionFn);
    expect(subscription['_safeSubscriptions'].get('a')).toHaveProperty('subscription');
    expect(subscription['_safeSubscriptions'].get('a')?.subscription.closed).toBeFalse();
  });

  it(`#add(key, subscriptionFn) do nothing if existing key and active subscription`, () => {
    subscription.add('a', subscriptionFn);
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn);
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();
  });

  it(`#add(key, subscriptionFn) replaces if existing key and closed subscription`, () => {
    subscription.add('a', subscriptionFn);
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    sub1?.unsubscribe();
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn);
    expect(sub1?.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it(`#add(key, subscriptionFn) subscribes again from replaced key`, () => {
    subscription.add('a', subscriptionFn);
    subscription['_safeSubscriptions'].get('a')?.subscription.unsubscribe();

    subscription.add('a', subscriptionFn);
    expect(subscription['_safeSubscriptions'].get('a')?.subscription?.closed).toBeFalse();
  });

  it(`#add(key, subscriptionFn, args) replaces if existing key, diferent args and active subscription`, () => {
    subscription.add('a', subscriptionFn, 'a');
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn, 'b');
    expect(sub1?.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it(`#add(key, subscriptionFn, args) replaces if existing key, diferent args and closed subscrption`, () => {
    subscription.add('a', subscriptionFn, 'a');
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    sub1?.unsubscribe();
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn, 'b');
    expect(sub1?.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it(`#add(key, subscriptionFn, args) do nothing if existing key, equal args and active subscription`, () => {
    subscription.add('a', subscriptionFn, 'a');
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn, 'a');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();
  });

  it(`#add(key, subscriptionFn, args) replaces if existing key, equal args and closed subscription`, () => {
    subscription.add('a', subscriptionFn, 'a');
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    sub1?.unsubscribe();
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn, 'a');
    expect(sub1?.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it(`#add(key, subscriptionFn, args) uses deep equals for args`, () => {
    subscription.add('a', subscriptionFn, { a: 0, b: 1 });
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    sub1?.unsubscribe();
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.add('a', subscriptionFn, { a: 0, b: 1 });
    const sub2: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    jest.spyOn(sub2 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).toHaveBeenCalledTimes(1);

    subscription.add('a', subscriptionFn, { a: 0, b: 1 });
    expect(sub2?.unsubscribe).not.toHaveBeenCalled();
  });

  it(`#get(key) returns the key Subscription`, () => {
    subscription.add('a', subscriptionFn);
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    expect(subscription.get('a')).not.toBeUndefined();
    expect(subscription.get('a')).toEqual(sub1);
  });

  it(`#get(key) returns undefined if no key`, () => {
    subscription.add('a', subscriptionFn);
    expect(subscription.get('b')).toBeUndefined();
  });

  it(`#unsubscribe(key) unsubscribe the key Subscription`, () => {
    subscription.add('a', subscriptionFn);
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();
    expect(sub1?.closed).toBeFalse();

    subscription.unsubscribe('a');
    expect(sub1?.unsubscribe).toHaveBeenCalledTimes(1);
    expect(sub1?.closed).toBeTrue();
  });

  it(`#unsubscribe(key) deletes the key`, () => {
    subscription.add('a', subscriptionFn);
    expect(subscription['_safeSubscriptions'].get('a')).toBeDefined();

    subscription.unsubscribe('a');
    expect(subscription['_safeSubscriptions'].get('a')).toBeUndefined();
  });

  it(`#unsubscribe(key) do nothing if no key`, () => {
    subscription.add('a', subscriptionFn);
    const sub1: Subscription | undefined = subscription['_safeSubscriptions'].get('a')?.subscription;
    jest.spyOn(sub1 as Subscription, 'unsubscribe');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();

    subscription.unsubscribe('b');
    expect(sub1?.unsubscribe).not.toHaveBeenCalled();
    expect(subscription['_safeSubscriptions'].get('a')).toBeDefined();
    expect(subscription['_safeSubscriptions'].get('b')).toBeUndefined();
  });

  it(`#unsubscribe(key, key) deletes multiple keys`, () => {
    subscription.add('a', subscriptionFn);
    subscription.add('b', subscriptionFn);
    subscription.add('c', subscriptionFn);
    expect(subscription['_safeSubscriptions'].get('a')).toBeDefined();
    expect(subscription['_safeSubscriptions'].get('b')).toBeDefined();
    expect(subscription['_safeSubscriptions'].get('c')).toBeDefined();

    subscription.unsubscribe('a', 'b');
    expect(subscription['_safeSubscriptions'].get('a')).toBeUndefined();
    expect(subscription['_safeSubscriptions'].get('b')).toBeUndefined();
    expect(subscription['_safeSubscriptions'].get('c')).toBeDefined();
  });

  it(`#unsubscribe() unsubscribes all subscriptions`, () => {
    subscription.add('a', subscriptionFn);
    subscription.add('b', subscriptionFn);
    subscription.add('c', subscriptionFn);
    expect(subscription['_safeSubscriptions'].get('a')).toBeDefined();
    expect(subscription['_safeSubscriptions'].get('b')).toBeDefined();
    expect(subscription['_safeSubscriptions'].get('c')).toBeDefined();

    subscription.unsubscribe();
    expect(subscription['_safeSubscriptions'].get('a')).toBeUndefined();
    expect(subscription['_safeSubscriptions'].get('b')).toBeUndefined();
    expect(subscription['_safeSubscriptions'].get('c')).toBeUndefined();
  });
});
