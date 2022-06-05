# Race Condition

> A set of tools to avoid race conditions in RxJS subscriptions.

[![npm](https://img.shields.io/npm/v/@kuoki/race-condition?logo=npm&style=flat-square)](https://www.npmjs.com/package/@kuoki/race-condition)
[![Documentation](https://img.shields.io/badge/documentation-done-blue?style=flat-square)](https://ricardojbarrios.github.io/kuoki/race-condition/)
[![Coverage](https://img.shields.io/sonar/coverage/kuoki-race-condition/master?server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://ricardojbarrios.github.io/kuoki/race-condition/coverage/)
[![Quality Gate Status](https://img.shields.io/sonar/quality_gate/kuoki-race-condition?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://sonarcloud.io/project/overview?id=kuoki-race-condition)
[![GitHub](https://img.shields.io/github/license/ricardojbarrios/kuoki?style=flat-square)](https://github.com/RicardoJBarrios/kuoki/blob/main/LICENSE.md)
[![GitHub issues environment](https://img.shields.io/github/issues/ricardojbarrios/kuoki/race-condition?logo=github&label=issues&style=flat-square)](https://github.com/RicardoJBarrios/kuoki/labels/race-condition)

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## About The Project

The usual way to avoid race conditions in RxJS is to use `switchMap`.

```ts
import { HttpCLient, Params } from '...';
import { Subject, switchMap } from 'rxjs';

class TestClass {
  private load$ = new Subject<Params>();

  constructor(protected readonly http: HttpCLient) {
    this._watchLoad$();
  }

  private _watchLoad$() {
    this.load$.pipe(switchMap((params) => this.http.get('path', { params }))).subscribe();
  }

  load(params: Params) {
    this.load$.next(params);
  }
}
```

This method is quite cumbersome and doesn't prevent unnecessary calls. This library allows to manage this problem in a simpler way, avoiding unnecessary calls.

## Getting Started

### Installation

Using NPM

```sh
npm install --save @kuoki/race-condition
```

Using Yarn

```sh
yarn add @kuoki/race-condition
```

Dependencies

- [rxjs](https://rxjs.dev) >= 6.0.0

## Usage

### RaceConditionFreeSubscription

#### add

```ts
import { HttpCLient, Params } from '...';
import { RaceConditionFreeSubscription } from '@kuoki/race-condition';

class TestClass {
  protected subscriptions = new RaceConditionFreeSubscription();

  constructor(protected readonly http: HttpCLient) {}

  noSafeLoad(params: Params) {
    this.http.get('path', { params }).subscribe();
  }

  load(params: Params) {
    const _load = () => this.http.get('path', { params }).subscribe();
    this.subscriptions.add('load', _load, params);
  }
}
```

This class is very useful when calling functions that return an Observable with arguments, mainly avoiding memory leaks and race conditions due to slow loads.

```ts
noSafeLoad({ a: '0' }); // ----------(a|)
noSafeLoad({ a: '1' }); //   ^--(a|)
```

In this example, the user wants to display the data filtering by `{ a: 0 }`, but right after filter again by using `{ a: 1 }`. The second call resolves faster, so it is displayed first, but when the first call resolves it replaces the values ​​that were displayed with its own, and obviously these are not the results that the user expected to get. Using this method we solve this problem through the following behavior:

- If the call is repeated with the same arguments and the previous subscription has not completed, ignores the new call and continue using the old subscription.

```ts
load({ a: '0' }); // -----(a|)
load({ a: '0' }); //   ^
```

- If the call is repeated with other arguments and the previous subscription has not completed, it completes it and replaces it with the new subscription.

```ts
load({ a: '0' }); // --|
load({ a: '1' }); //   ^----(a|)
```

- If the call is repeated and the subscription is complete, a new subscription is created.

```ts
load({ a: '0' }); // -----(a|)
load({ a: '0' }); //            ^----(a|)
```

#### get

```ts
this.subscriptions.get('load'); // 'load' Subscription
this.subscriptions.get('noKey'); // undefined
```

#### unsubscribe

```ts
this.subscriptions.unsubscribe('load'); // unsubscribes 'load' Subscription
this.subscriptions.unsubscribe(); // unsubscribes all subscriptions
```

### @RaceConditionFree()

This decorator allows you to simplify the way you handle race conditions by applying it in a method that returns a subscription. This also allows for cleaner code and to use other common decorators like `@debounce`.

```ts
import { HttpCLient, Params } from '...';
import { RaceConditionFree } from '@kuoki/race-condition';
import { Subscription } from 'rxjs';

class TestClass {
  constructor(protected readonly http: HttpCLient) {}

  @RaceConditionFree()
  load(params: Params): Subscription {
    return this.http.get('path', { params }).subscribe();
  }
}
```
