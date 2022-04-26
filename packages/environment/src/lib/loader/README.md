# Environment Loader

> Loads the environment properties from the provided asynchronous sources.

The environment loader is an interface that must be implemented to load the properties to the environment. Can be integrated into any application using the provided default implementation or a custom one.

```ts
import { EnvironmentLoader } from '@kuoki/environment';

class CustomEnvironmentLoader implements EnvironmentLoader {
  // ...implement environment loader interface
}
```

## DefaultEnvironmentLoader

A basic implementation that can be instantiated from...

1. A factory function.

```js
import {
  createEnvironmentLoader,
  createEnvironmentService,
  createEnvironmentStore,
  EnvironmentLoader,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentStore
} from '@kuoki/environment';

const envSource: EnvironmentSource = {
  load: async () => fetch('env.json').then((response: Response) => response.json())
};

const environmentStore: EnvironmentStore = createEnvironmentStore();
const environmentService: EnvironmentService = createEnvironmentService(environmentStore);
const environmentLoader: EnvironmentLoader = createEnvironmentLoader(environmentService, envSource);
```

1. The newable class.

```js
import {
  DefaultEnvironmentLoader,
  DefaultEnvironmentService,
  DefaultEnvironmentStore,
  EnvironmentLoader,
  EnvironmentService,
  EnvironmentSource,
  EnvironmentStore
} from '@kuoki/environment';

const envSource: EnvironmentSource = {
  load: async () => fetch('env.json').then((response: Response) => response.json())
};

const environmentStore: EnvironmentStore = new DefaultEnvironmentStore();
const environmentService: EnvironmentService = new DefaultEnvironmentService(environmentStore);
const environmentLoader: EnvironmentLoader = new DefaultEnvironmentLoader(environmentService, envSource);
```

1. A class that extends `DefaultEnvironmentQuery`.

```ts
import { DefaultEnvironmentLoader, EnvironmentService, EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

class CustomEnvironmentLoader extends DefaultEnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null
  ) {
    super(service, sources);
  }
  // ...override implementation
}

const envSource: EnvironmentSource = {
  load: async () => fetch('env.json').then((response: Response) => response.json())
};

const environmentStore: EnvironmentStore = new DefaultEnvironmentStore();
const environmentService: EnvironmentService = new DefaultEnvironmentService(environmentStore);
const environmentLoader: EnvironmentLoader = new CustomEnvironmentLoader(environmentService, envSource);
```

## Use cases

There are more examples of use in the EnvironmentSource and LyfecycleHooks documentation.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#load">load</a></li>
    <li><a href="#preaddproperties">preAddProperties()</a></li>
    <li><a href="#getsourcebyid">getSourceById()</a></li>
    <li><a href="#resolveload">resolveLoad()</a></li>
    <li><a href="#rejectload">rejectLoad()</a></li>
    <li><a href="#completeallsources">completeAllSources()</a></li>
    <li><a href="#completesource">completeSource()</a></li>
    <li><a href="#ondestroy">onDestroy()</a></li>
    <li><a href="#avoid-concurrent-loads">Avoid concurrent loads</a></li>
  </ol>
</details>

### Load

```js
environmentLoader
  .load()
  .then(() => {
    /* Do something after all required properties are loaded */
  })
  .catch(<E>(error: E) => {
    /* Do something on required load error */
  });
```

### preAddProperties()

Middleware to modify properties before be stored. Its's executed after `EnvironmentSource.mapFn()`.

```js
// Modifies all 'date' properties to be ISO string
environmentLoader.preAddProperties = (properties) => {
  if (properties?.date != null) {
    properties.date = new Date(properties.date).toISOString();
  }

  return properties;
};
```

### getSourceById()

```js
const envSource: EnvironmentSource = {
  id: 'env-source',
  load: async () => fetch('env.json').then((response: Response) => response.json())
};

environmentLoader.getSourceById('env-source'); // The envSource as loader source
environmentLoader.getSourceById('other'); // undefined
```

### resolveLoad()

Use this method to resolve load if a condition is true.

```js
class CustomEnvironmentLoader extends DefaultEnvironmentLoader implements OnAfterSourceAdd {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null,
    protected override readonly query: EnvironmentQuery,
  ) {
    super(service, sources);
  }

  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    if (this.query.get('username') != null) {
      this.resolveLoad();
    }
  }
}
```

### rejectLoad()

Use this method to reject the load if a condition is true.

```js
class CustomEnvironmentLoader extends DefaultEnvironmentLoader implements OnAfterSourceError {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null,
    protected override readonly query: EnvironmentQuery,
  ) {
    super(service, sources);
  }

  onAfterSourceError(error: Error, source: LoaderSource): void {
    if (source.id === 'conditional-required' && this.query.get('throwIfConditionalError') === true) {
      this.rejectLoad();
    }
  }
}
```

### completeAllSources()

Complete ongoing and future source loads if a condition is true.

```js
class CustomEnvironmentLoader extends DefaultEnvironmentLoader implements OnAfterSourceAdd {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null,
    protected override readonly query: EnvironmentQuery,
  ) {
    super(service, sources);
  }

  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    if (this.query.get('username') != null) {
      this.completeAllSources();
    }
  }
}
```

### completeSource()

Complete an specific source if a condition is true.

```js
class CustomEnvironmentLoader extends DefaultEnvironmentLoader implements OnAfterSourceAdd {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null,
    protected override readonly query: EnvironmentQuery,
  ) {
    super(service, sources);
  }

  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    if (this.query.get('username') != null) {
      const source: LoaderSource | undefined = this.getSourceById('failover-username-source');
      if (source != null) {
        this.completeSource(source);
      }
    }
  }
}
```

### onDestroy()

Destroy the loader, completes all observables to avoid memory leaks and resolves the load.

```js
class CustomEnvironmentLoader extends DefaultEnvironmentLoader implements OnAfterSourceAdd {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<EnvironmentSource> | null,
    protected override readonly query: EnvironmentQuery,
  ) {
    super(service, sources);
  }

  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    if (this.query.get('username') != null) {
      this.onDestroy();
    }
  }
}
```

### Avoid concurrent loads

```ts
import { DefaultEnvironmentLoader, EnvironmentService, EnvironmentSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

class CustomEnvironmentLoader extends EnvironmentLoader {
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<EnvironmentSource>
  ) {
    super(service, sources);
  }

  override async load(): Promise<void> {
    if (this.isLoading) {
      const error: Error = new Error('There is already a load in progress');

      return Promise.reject(error);
    }

    return super.load();
  }
}
```
