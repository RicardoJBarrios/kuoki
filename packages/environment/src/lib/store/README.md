# Environment Store

> Stores the environment properties that the application needs.

An environment store is a gateway that must be implemented to manage the environment state. Can be integrated into any state manager already using the application or create your own.

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#getall">getAll$</a></li>
    <li><a href="#getall-1">getAll</a></li>
    <li><a href="#update">update</a></li>
    <li><a href="#reset">reset</a></li>
    <li><a href="#rxjs">RxJS</a></li>
    <li><a href="#redux">Redux</a></li>
    <li><a href="#akita">Akita</a></li>
  </ol>
</details>

### getAll$

```js
// EnvironmentState = ^{a:0}-{a:0}-{a:0,b:0}-
store.getAll$(); // ^{a:0}-{a:0}-{a:0,b:0}-
```

### getAll

```js
// EnvironmentState = {a:0}
store.getAll(); // {a:0}
```

### update

It is important to ensure that **the store update is an overwrite and not a partial update**,
as the service will manage the entire environment in the implementation,
and a partial update can cause inconsistencies.

```js
// CORRECT: Overwrite
// EnvironmentState = {a:0}
store.update({ b: 0 });
// EnvironmentState = {b:0}
```

```js
// WRONG: Partial Update
// EnvironmentState = {a:0}
store.update({ b: 0 });
// EnvironmentState = {a:0,b:0}
```

### reset

```js
// EnvironmentState = {a:0}
store.reset();
// EnvironmentState = {}
```

### RxJS

A basic RxJS implementation that uses a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) as state manager.

```js
import { BehaviorSubject } from 'rxjs';

const initialState = {};
const store = new BehaviorSubject(initialState);
export const environmentStore = {
  getAll$: () => store.asObservable(),
  getAll: () => store.getValue(),
  update: (environment) => store.next(environment),
  reset: () => store.next(initialState)
};
```

```ts
import { EnvironmentState, EnvironmentStore } from '@kuoki/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export class RxJSEnvironmentStore implements EnvironmentStore {
  protected readonly state: BehaviorSubject<EnvironmentState> = new BehaviorSubject(this.initialState);

  constructor(protected readonly initialState: EnvironmentState = {}) {}

  getAll$(): Observable<EnvironmentState> {
    return this.state.asObservable();
  }

  getAll(): EnvironmentState {
    return this.state.getValue();
  }

  update(environment: EnvironmentState): void {
    this.state.next(environment);
  }

  reset(): void {
    this.state.next(this.initialState);
  }
}
```

### Redux

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

### Akita

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
