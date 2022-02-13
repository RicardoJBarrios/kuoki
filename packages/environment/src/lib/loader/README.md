# Environment Loader

> Loads the environment properties from the provided asynchronous sources.

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#add-logs-to-the-loader">Add logs to the loader</a></li>
    <li><a href="#throws-an-error-if-concurrent-load">Throws an error if concurrent load</a></li>
    <li><a href="#resolve-when-setting-a-subset-of-properties">Resolve when setting a subset of properties</a></li>
  </ol>
</details>

### Add logs to the loader

```ts
class Loader
  extends EnvironmentLoader
  implements
    OnAfterLoad,
    OnAfterComplete,
    OnAfterError,
    OnAfterSourceAdd,
    OnAfterSourceComplete,
    OnAfterSourceError,
    OnBeforeLoad,
    OnBeforeSourceAdd,
    OnBeforeSourceLoad
{
  constructor(protected override service: EnvironmentService, protected override sources?: any) {
    super(service, sources);
  }
  onAfterLoad(): void {
    console.log('onAfterLoad');
  }
  onAfterComplete(): void {
    console.log('onAfterComplete');
  }
  onAfterError<E extends Error>(error: E): void {
    console.log('onAfterError', error);
  }
  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    console.log('onAfterSourceAdd', properties, source);
  }
  onAfterSourceComplete(source: LoaderSource): void {
    console.log('onAfterSourceComplete', source);
  }
  onAfterSourceError(error: Error, source: LoaderSource): void {
    console.log('onAfterSourceError', error, source);
  }
  onBeforeLoad(): void {
    console.log('onBeforeLoad');
  }
  onBeforeSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    console.log('onBeforeSourceAdd', properties, source);
  }
  onBeforeSourceLoad(source: LoaderSource): void {
    console.log('onBeforeSourceLoad', source);
  }
}
```

### Throws an error if concurrent load

```ts

```

### Resolve when setting a subset of properties

```ts

```
