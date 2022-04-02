# Environment Loader

> Loads the environment properties from the provided asynchronous sources.

The environment loader is an interface that must be implemented to load the properties to the environment. The base implementation can be directly instantiated or customized by creating a custom inherit class that overrides the methods.

```js
import { createEnvironmentLoader } from '@kuoki/environment';
import { service } from '...';
import { sources } from '...';

const loader = createEnvironmentLoader(service, sources);
```

```js
import { EnvironmentLoader } from '@kuoki/environment';
import { service } from '...';
import { sources } from '...';

const loader = new EnvironmentLoader(service, sources);
```

```ts
import { EnvironmentLoader, EnvironmentService, LoaderSource } from '@kuoki/environment';
import { ArrayOrSingle } from 'ts-essentials';

class CustomEnvironmentLoader extends EnvironmentLoader {
  constructor(
    protected override readonly service: EnvironmentService,
    protected override readonly sources?: ArrayOrSingle<LoaderSource>
  ) {
    super(service, sources);
  }
}
```

## Use cases

There are more examples of use in the EnvironmentSource and LyfecycleHooks documentation.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#load">load</a></li>
    <li><a href="#pre-add-properties-middleware">Pre Add Properties Middleware</a></li>
    <li><a href="#avoid-concurrent-loads">Avoid concurrent loads</a></li>
  </ol>
</details>

### Load

```js
loader
  .load()
  .then(() => {
    /* DO SOMETHING ONCE ALL REQUIRED SOURCES ARE LOADED */
  })
  .catch((error: Error) => {
    /* DO SOMETHING ON LOAD ERROR */
  });
```

### Pre Add Properties Middleware

```js
import { createEnvironmentLoader } from '@kuoki/environment';
import { service } from '...';
import { sources } from '...';
import { convertToUTC } from '...';

const loader = createEnvironmentLoader(service, sources);
loader.preAddProperties = (properties, source) => {
  if (source?.id === 'calendarSource' && properties?.currentDateTime != null) {
    properties.currentDateTime = convertToUTC(properties.currentDateTime);
  }

  return properties;
};
```

### Avoid concurrent loads

```ts
class Loader extends EnvironmentLoader {
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<LoaderSource>
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
