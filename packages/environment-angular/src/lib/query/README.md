# Angular Environment Query

> Gets the properties from the environment.

## DefaultEnvironmentQuery

The default environment query implementation to get the environment values.

This query is provided by defaut when running `EnvironmentModule.forRoot()`, but can be provided manually.

```ts
import { Provider } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { DefaultEnvironmentQuery } from '@kuoki/environment-angular';

export const ENVIRONMENT_QUERY_PROVIDER: Provider = {
  provide: EnvironmentQuery,
  useClass: DefaultEnvironmentQuery
};
```

Unless `ENVIRONMENT_QUERY_CONFIG` is provided, the initial query config is `{}`.

## ENVIRONMENT_QUERY_CONFIG

The `ENVIRONMENT_QUERY_CONFIG` injection token contains the configuration parameters for the EnvironmentQuery.

```ts
import { Provider } from '@angular/core';
import { ENVIRONMENT_QUERY_CONFIG } from '@kuoki/environment-angular';

export const ENVIRONMENT_QUERY_CONFIG_PROVIDER: Provider = {
  provide: ENVIRONMENT_QUERY_CONFIG,
  useValue: { transpileEnvironment: true }
};
```

The default value provided by `EnvironmentModule.forRoot()` is `{}`, but can be set in configuration.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';

EnvironmentModule.forRoot({ queryConfig: { transpileEnvironment: true } });
```

## Use cases

Below are examples of the expected behavior and some implementation examples. To learn more about environment query and how to create them you can read the [documentation](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html).

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#create-a-custom-query">Create a custom query</a></li>
  </ol>
</details>

### Create a custom query

To create a custom environment query that uses `ENVIRONMENT_QUERY_CONFIG` simply complete the next class.

```ts
import { Inject, Injectable, Optional } from '@angular/core';
import { EnvironmentQueryConfig, EnvironmentStore } from '@kuoki/environment';

import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from '@kuoki/environment-angular';

@Injectable()
export class CustomEnvironmentQuery extends DefaultEnvironmentQuery {
  constructor(
    protected override readonly store: EnvironmentStore,

    @Optional()
    @Inject(ENVIRONMENT_QUERY_CONFIG)
    protected override readonly queryConfig?: EnvironmentQueryConfig | null
  ) {
    super(store, queryConfig);
  }
}
```

Once implemented must be provided:

1. Using the `EnvironmentModule.forRoot()`.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { CustomEnvironmentQuery } from './custom-environment.query.ts';

EnvironmentModule.forRoot({ query: CustomEnvironmentQuery });
```

2. Or using a provider.

```ts
import { Provider } from '@angular/core';
import { EnvironmentQuery } from '@kuoki/environment';
import { CustomEnvironmentQuery } from './custom-environment.query.ts';

export const ENVIRONMENT_QUERY_PROVIDER: Provider = {
  provide: EnvironmentQuery,
  useClass: CustomEnvironmentQuery
};
```
