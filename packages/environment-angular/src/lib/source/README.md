# Angular Environment Sources

> The sources from which to get environment properties.

## ENVIRONMENT_SOURCES

The `ENVIRONMENT_SOURCES` injection token is used to set the sources from which to get environment properties.
The default value provided by `EnvironmentModule.forRoot()` is `[]`.

```ts
import { Provider } from '@angular/core';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';
import { Source1, Source2 } from './sources.ts';

export const ENVIRONMENT_SOURCES_PROVIDER: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useValue: [Source1, Source2]
};
```

Can also be provided individually using `multi: true`.

```ts
import { Provider } from '@angular/core';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';
import { Source1, Source2 } from './sources.ts';

export const ENVIRONMENT_SOURCES_PROVIDERS: Provider[] = [
  { provide: ENVIRONMENT_SOURCES, useValue: Source1, multi: true },
  { provide: ENVIRONMENT_SOURCES, useValue: Source2, multi: true }
];
```

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#feature-module-sources">Feature Module Sources</a></li>
  </ol>
</details>

### Feature Module Sources
