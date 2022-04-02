# Environment Store

> Stores the environment properties that the application needs.

An environment store is an interface that must be implemented to manage the environment state. Can be integrated into any application using the provided default implementation or a custom one to integrate it with any state manager already used by the application.

```ts
import { EnvironmentStore } from '@kuoki/environment';

class CustomEnvironmentStore implements EnvironmentStore {
  // ...implement environment store interface
}

const environmentStore: EnvironmentStore = new CustomEnvironmentStore();
```

## DefaultEnvironmentStore

A basic RxJS environment store implementation that uses a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) as state manager that can be instantiated from...

1. A factory function.

```js
import { createEnvironmentStore, EnvironmentStore } from '@kuoki/environment';

const environmentStore1: EnvironmentStore = createEnvironmentStore({});
const environmentStore2: EnvironmentStore = createEnvironmentStore({ a: 0 });
```

1. The newable class.

```js
import { DefaultEnvironmentStore, EnvironmentStore } from '@kuoki/environment';

const environmentStore1: EnvironmentStore = new DefaultEnvironmentStore({});
const environmentStore2: EnvironmentStore = new DefaultEnvironmentStore({ a: 0 });
```

1. A class that extends `DefaultEnvironmentStore`.

```ts
import { DefaultEnvironmentStore, EnvironmentState, EnvironmentStore } from '@kuoki/environment';

class CustomEnvironmentStore extends DefaultEnvironmentStore {
  constructor(protected override readonly _initialState?: EnvironmentState) {
    super(_initialState);
  }
  // ...override implementation
}

const environmentStore1: EnvironmentStore = new CustomEnvironmentStore({});
const environmentStore2: EnvironmentStore = new CustomEnvironmentStore({ a: 0 });
```

## Use cases

Below are examples of the expected behavior and some custom implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#getall">getAll$</a></li>
    <li><a href="#getall-1">getAll</a></li>
    <li><a href="#update">update</a></li>
    <li><a href="#reset">reset</a></li>
    <li><a href="#implementation-using-redux">Implementation using Redux</a></li>
    <li><a href="#implementation-using-akita">Implementation using Akita</a></li>
  </ol>
</details>

### getAll$

```js
// EnvironmentState = ^{a:0}-{a:0}-{a:0,b:0}-
environmentStore.getAll$(); // ^{a:0}-{a:0}-{a:0,b:0}-
```

### getAll

```js
// EnvironmentState = ^{a:0}-{a:0}-{a:0,b:0}-
environmentStore.getAll(); // {a:0}
```

### update

It is important to ensure that **the store update is an overwrite and not a partial update**,
as the service will manage the entire environment in the implementation,
and a partial update can cause inconsistencies.

```js
// CORRECT: Overwrite
// EnvironmentState = {a:0}
environmentStore.update({ b: 0 });
// EnvironmentState = {b:0}
```

```js
// WRONG: Partial Update
// EnvironmentState = {a:0}
environmentStore.update({ b: 0 });
// EnvironmentState = {a:0,b:0}
```

### reset

```js
// EnvironmentState = {a:0}
environmentStore.reset();
// EnvironmentState = {}
```

### Implementation using Redux

[Redux](https://redux.js.org/) is a predictable state container for JavaScript apps.

```js
import { createStore } from 'redux';
import { from } from 'rxjs';

const initialState = {};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE':
      return action.environment;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};
const store = createStore(reducer);
export const environmentStore = {
  getAll$: () => from(store),
  getAll: () => store.getState(),
  update: (environment) => store.dispatch({ type: 'UPDATE', environment }),
  reset: () => store.dispatch({ type: 'RESET' })
};
```

### Implementation using Akita

[Akita](https://datorama.github.io/akita/) is a state management pattern built on top of RxJS.

```js
import { createStore } from '@datorama/akita';

const store = createStore({}, { name: 'environment', resettable: true });
export const environmentStore = {
  getAll$: () => store._select((state) => state),
  getAll: () => store.getValue(),
  update: (environment) => store._setState(environment),
  reset: () => store.reset()
};
```
