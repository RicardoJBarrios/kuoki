# Angular Environment Service

> Sets the EnvironmentState properties.

This service is responsible for mutating the EnvironmentState values. It is normally only needed for the load operation, and should not be exposed to the rest of the application unless for functional reasons the properties can be mutated at runtime. Each method returns an `EnvironmentResult` to make it easy to develop customizations.

EnvironmentService is an interface that must be implemented to mutate the environment store. Can be integrated into any application using the provided default implementation or a custom one.

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
import { EnvironmentStore } from '@kuoki/environment';
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

2. Using a provider.

```ts
import { Provider } from '@angular/core';
import { EnvironmentService } from '@kuoki/environment';
import { CustomEnvironmentService } from './custom-environment.service.ts';

export const ENVIRONMENT_SERVICE_PROVIDER: Provider = {
  provide: EnvironmentService,
  useClass: CustomEnvironmentService
};
```
