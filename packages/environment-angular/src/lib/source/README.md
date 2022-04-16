# Angular Environment Sources

> The sources from which to get environment properties.

## ENVIRONMENT_SOURCES

The `ENVIRONMENT_SOURCES` injection token is used to set the sources from which to get environment properties. The sources can be setted as an injectable Class, a plain object or an object instance.

If there is a single source inject using `useClass`.

```ts
import { Provider } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';

export class Source1 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

export const ENVIRONMENT_SOURCES_PROVIDERS: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useClass: Source1
};
```

If there are multiple sources inject the Array using `useValue`.

```ts
import { Injectable, Provider } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';

@Injectable({ providedIn: 'root' })
export class Source1 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

export class Source2 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}

export const ENVIRONMENT_SOURCES_PROVIDERS: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useValue: [Source1, { load: () => [{ a: 0 }] }, new Source2()]
};
```

The default value provided by `EnvironmentModule.forRoot()` is `null`, but can be set in configuration.

Can be used with single source.

```ts
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { EnvironmentModule } from '@kuoki/environment-angular';

@Injectable({ providedIn: 'root' })
export class Source1 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

EnvironmentModule.forRoot({ sources: Source1 });
```

Can also be used with multiple sources.

```ts
import { Injectable } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { EnvironmentModule } from '@kuoki/environment-angular';

@Injectable({ providedIn: 'root' })
export class Source1 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

export class Source2 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}

EnvironmentModule.forRoot({ sources: [Source1, { load: () => [{ a: 0 }] }, new Source2()] });
```

## ENVIRONMENT_SOURCES_FACTORY

In order to be able to override the `ENVIRONMENT_SOURCES` injection token in feature modules and allow the use of multiple sources, the module provides the `ENVIRONMENT_SOURCES_FACTORY` injection token, that uses a factory to inject all source objects in an Array.

```ts
import { Injectable } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { EnvironmentModule } from '@kuoki/environment-angular';

@Injectable({ providedIn: 'root' })
export class Source1 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

@Injectable({ providedIn: 'root' })
export class Source2 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ b: 0 }];
  }
}

@Injectable({ providedIn: 'root' })
export class Source3 extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [{ c: 0 }];
  }
}

EnvironmentModule.forRoot({ sources: [Source1, Source2] });
// ENVIRONMENT_SOURCES_FACTORY = [
//    Source1 { id: ...},
//    Source2 { id: ...}
// ]

EnvironmentModule.forChild({ sources: Source3 });
// ENVIRONMENT_SOURCES_FACTORY = [
//    Source3 { id: ...},
// ]
```

## Use cases

Below are examples of the expected behavior and some implementation examples. To learn more about environment sources and how to create them you can read the [documentation](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentSource.html).

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#feature-module-sources">Feature Module Sources</a></li>
    <li><a href="#load-the-static-environment-of-angular">Load the static environment of Angular</a></li>
  </ol>
</details>

### Feature Module Sources

If a feature module need a special set of environment properties can define a specific set of sources using the `ENVIRONMENT_SOURCES` injection token or `EnvironmentModule.forChild()`, as described in the `EnvironmentModule` documentation.

```ts
import { Provider } from '@angular/core';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';
import { Source1 } from './sources.ts';

export const ENVIRONMENT_SOURCES_PROVIDERS: Provider = { provide: ENVIRONMENT_SOURCES, useClass: Source1 };
```

The default value provided by `EnvironmentModule.forChild()` is `null`, but can be set in configuration.

```ts
import { EnvironmentModule } from '@kuoki/environment-angular';
import { Source1, Source2 } from './sources.ts';

EnvironmentModule.forChild({ sources: [Source1, Source2] });
```

### Load the static environment of Angular

```ts
import { Injectable, Provider } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { ENVIRONMENT_SOURCES } from '@kuoki/environment-angular';

import { environment } from './../environments/environment';

@Injectable()
export class StaticEnvironmentSource extends EnvironmentSource {
  load(): EnvironmentState[] {
    return [environment];
  }
}

export const ENVIRONMENT_SOURCE_PROVIDER: Provider = {
  provide: ENVIRONMENT_SOURCES,
  useClass: StaticEnvironmentSource
};
```
