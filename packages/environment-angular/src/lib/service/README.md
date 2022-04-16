# Angular Environment Service

> Sets the environment properties in the store.

## DefaultEnvironmentService

The default environment service implementation to mutate the environment store.

This service is provided by defaut when running `EnvironmentModule.forRoot()`, but can be provided manually.

```ts
import { Provider } from '@angular/core';
import { EnvironmentService } from '@kuoki/environment';
import { DefaultEnvironmentService } from '@kuoki/environment-angular';

export const ENVIRONMENT_SERVICE_PROVIDER: Provider = {
  provide: EnvironmentService,
  useClass: DefaultEnvironmentService
};
```

## Use cases

Below are examples of the expected behavior and some implementation examples. To learn more about environment service and how to create them you can read the [documentation](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentService.html).

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#create-a-custom-service">Create a custom service</a></li>
  </ol>
</details>

### Create a custom service

To create a custom environment service simply complete the next class.

```ts
import { Injectable } from '@angular/core';
import { DefaultEnvironmentService } from '@kuoki/environment-angular';

@Injectable()
export class CustomEnvironmentService extends DefaultEnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }

  // Override the implementation
}
```

Once implemented must be provided:

1. Using the `EnvironmentModule.forRoot()`.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { CustomEnvironmentService } from './custom-environment.service.ts';

EnvironmentModule.forRoot({ service: CustomEnvironmentService });
```

2. Or using a provider.

```ts
import { Provider } from '@angular/core';
import { EnvironmentService } from '@kuoki/environment';
import { CustomEnvironmentService } from './custom-environment.service.ts';

export const ENVIRONMENT_SERVICE_PROVIDER: Provider = {
  provide: EnvironmentService,
  useClass: CustomEnvironmentService
};
```
