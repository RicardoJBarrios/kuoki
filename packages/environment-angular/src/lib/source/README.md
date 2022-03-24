# Angular Environment Sources

> The sources from which to get environment properties.

## ENVIRONMENT_SOURCES

The `ENVIRONMENT_SOURCES` injection token is used to set the sources from which to get environment properties.

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

The default value provided by `EnvironmentModule.forRoot()` is `[]`, but can be set in configuration.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { Source1, Source2 } from './sources.ts';

EnvironmentModule.forRoot({ sources: [Source1, Source2] });
```

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#feature-module-sources">Feature Module Sources</a></li>
    <li><a href="#load-the-static-environment-of-angular">Load the static environment of Angular</a></li>
  </ol>
</details>

### Feature Module Sources

If a feature module need a special set of environment properties can define a specific set of sources using the `ENVIRONMENT_SOURCES` injection token or `EnvironmentModule.forChild()`, as described in the `EnvironmentModule` documentation.

If you're using the `multi: true` strategy be sure to overwrite the token values ​​so you don't download all the properties again.

```ts
import { Provider } from '@angular/core';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';
import { Source1, Source2, Source3 } from './sources.ts';

export const ENVIRONMENT_SOURCES_PROVIDERS: Provider[] = [
  { provide: ENVIRONMENT_SOURCES, useValue: Source1, multi: true },
  { provide: ENVIRONMENT_SOURCES, useValue: Source2, multi: true }
];

// With this definition the feature module will get the
// Source1, Source2 and Source3 properties on load.
export const FEATURE_ENVIRONMENT_SOURCES_PROVIDER: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useValue: Source3,
  multi: true
};

// With this definition the feature module will get the
// Source3 properties on load.
export const FEATURE_ENVIRONMENT_SOURCES_PROVIDE: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useValue: Source3
};
```

The default value provided by `EnvironmentModule.forChild()` is `[]`, but can be set in configuration.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { Source1, Source2 } from './sources.ts';

EnvironmentModule.forChild({ sources: [Source1, Source2] });
```

### Load the static environment of Angular

```ts
import { Injectable } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';

import { environment } from './../environments/environment';

@Injectable()
export class StaticEnvironmentSource implements EnvironmentSource {
  readonly isRequired = true;

  load(): EnvironmentState[] {
    return [environment];
  }
}

export const STATIC_ENVIRONMENT_SOURCE_PROVIDER: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useValue: StaticEnvironmentSource,
  multi: true
};
```
