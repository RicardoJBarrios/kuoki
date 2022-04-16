# Angular Environment Store

> Stores the environment properties that the Angular application needs.

## DefaultEnvironmentStore

A simple implementation of the `EnvironmentStore` that uses a [BehaviorSubject](https://rxjs.dev/api/index/class/BehaviorSubject) as state manager.

This store is provided by defaut when running `EnvironmentModule.forRoot()`, but can be provided manually.

```ts
import { Provider } from '@angular/core';
import { EnvironmentStore } from '@kuoki/environment';
import { DefaultEnvironmentStore } from '@kuoki/environment-angular';

export const ENVIRONMENT_STORE_PROVIDER: Provider = {
  provide: EnvironmentStore,
  useClass: DefaultEnvironmentStore
};
```

Unless `ENVIRONMENT_INITIAL_STATE` is provided, the initial state of the store is `{}`.

## ENVIRONMENT_INITIAL_STATE

The `ENVIRONMENT_INITIAL_STATE` injection token is used to set the initial store value to `DefaultEnvironmentStore`.

```ts
import { Provider } from '@angular/core';
import { ENVIRONMENT_INITIAL_STATE } from '@kuoki/environment-angular';

export const INITIAL_STATE_PROVIDER: Provider = {
  provide: ENVIRONMENT_INITIAL_STATE,
  useValue: { a: 0 }
};
```

The default value provided by `EnvironmentModule.forRoot()` is `{}`, but can be set in configuration.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';

EnvironmentModule.forRoot({ initialState: { a: 0 } });
```

## Use cases

Below are examples of the expected behavior and some implementation examples. To learn more about environment store and how to create them you can read the [documentation](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentStore.html).

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#create-a-custom-store">Create a custom store</a></li>
    <li><a href="#provide-the-initial-state-from-local-storage">Provide the initial state from local storage</a></li>
  </ol>
</details>

### Create a custom store

To create a custom environment store that uses `ENVIRONMENT_INITIAL_STATE` simply complete the next class.

```ts
import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentState, EnvironmentStore } from '@kuoki/environment';
import { ENVIRONMENT_INITIAL_STATE } from '@kuoki/environment-angular';

@Injectable()
export class CustomEnvironmentStore implements EnvironmentStore {
  protected readonly initialState = this._initialState ?? {};

  constructor(
    @Optional()
    @Inject(ENVIRONMENT_INITIAL_STATE)
    protected readonly _initialState?: EnvironmentState
  ) {}

  // Complete the implementation
}
```

Once implemented must be provided:

1. Using the `EnvironmentModule.forRoot()`.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { CustomEnvironmentStore } from './custom-environment.store.ts';

EnvironmentModule.forRoot({ store: CustomEnvironmentStore });
```

2. Or using a provider.

```ts
import { Provider } from '@angular/core';
import { EnvironmentStore } from '@kuoki/environment';
import { CustomEnvironmentStore } from './custom-environment.store.ts';

export const ENVIRONMENT_STORE_PROVIDER: Provider = {
  provide: EnvironmentStore,
  useClass: CustomEnvironmentStore
};
```

### Provide the initial state from local storage

The `ENVIRONMENT_INITIAL_STATE` injection token can be used to load the initial state from the local storage, or any other local persistente layer.

```ts
import { Provider } from '@angular/core';
import { EnvironmentState } from '@kuoki/environment';
import { ENVIRONMENT_INITIAL_STATE } from '@kuoki/environment-angular';

function initialStateFromLocalStorage(): EnvironmentState {
  try {
    return JSON.parse(localStorage.getItem('environment') ?? '{}');
  } catch {
    return {};
  }
}

export const INITIAL_STATE_PROVIDER: Provider = {
  provide: ENVIRONMENT_INITIAL_STATE,
  useFactory: initialStateFromLocalStorage
};
```
