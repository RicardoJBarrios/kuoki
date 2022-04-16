# Angular Environment Loader

> Loads the environment properties from the provided asynchronous sources.

## DefaultEnvironmentLoader

The default environment loader implementation to load the properties to the environment.

This loader is provided by defaut when running `EnvironmentModule.forRoot()`, but can be provided manually.

```ts
import { Provider } from '@angular/core';
import { EnvironmentLoader } from '@kuoki/environment';
import { DefaultEnvironmentLoader } from '@kuoki/environment-angular';

export const ENVIRONMENT_QUERY_PROVIDER: Provider = {
  provide: EnvironmentLoader,
  useClass: DefaultEnvironmentLoader
};
```

Unless `ENVIRONMENT_SOURCES_FACTORY` is provided, the initial query config is `null`. To know more abour the environment sources factory read the sources [documentation](https://ricardojbarrios.github.io/kuoki/environment-angular/modules/EnvironmentSource.html).

## Use cases

Below are examples of the expected behavior and some implementation examples. To learn more about environment loader and how to create them you can read the [documentation](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentLoader.html).

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#create-a-custom-loader">Create a custom loader</a></li>
  </ol>
</details>

### Create a custom loader

To create a custom environment loader that uses `ENVIRONMENT_SOURCES_FACTORY` simply complete the next class.

```ts
import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentService, EnvironmentSource } from '@kuoki/environment';
import { DefaultEnvironmentLoader, ENVIRONMENT_SOURCES_FACTORY } from '@kuoki/environment-angular';
import { ArrayOrSingle } from 'ts-essentials';

@Injectable()
export class CustomEnvironmentLoader extends DefaultEnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,

    @Optional()
    @Inject(ENVIRONMENT_SOURCES_FACTORY)
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
}
```

Once implemented must be provided:

1. Using the `EnvironmentModule.forRoot()`.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { CustomEnvironmentLoader } from './custom-environment.loader.ts';

EnvironmentModule.forRoot({ loader: CustomEnvironmentLoader });
```

2. Or using a provider.

```ts
import { Provider } from '@angular/core';
import { EnvironmentLoader } from '@kuoki/environment';
import { CustomEnvironmentLoader } from './custom-environment.loader.ts';

export const ENVIRONMENT_LOADER_PROVIDER: Provider = {
  provide: EnvironmentLoader,
  useClass: CustomEnvironmentLoader
};
```
