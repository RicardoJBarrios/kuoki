# Lifecycle Hooks

## Use cases

Below are examples of the expected behavior with the default loader implementation.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#add-logs-to-the-loader">Add logs to the loader</a></li>
    <li><a href="#resolve-when-setting-a-subset-of-properties">Resolve when setting a subset of properties</a></li>
    <li><a href="#stop-loading-after-load-error">Stop loading after load error</a></li>
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
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<LoaderSource>
  ) {
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

### Resolve when setting a subset of properties

```ts
class Loader extends EnvironmentLoader implements OnAfterSourceAdd {
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<LoaderSource>,
    protected readonly query: EnvironmentQuery
  ) {
    super(service, sources);
  }

  onAfterSourceAdd(): void {
    const requiredProperties: Path[] = ['user.name', 'baseURL'];

    if (this.query.containsAll(...requiredProperties)) {
      this.resolveLoad();
    }
  }
}
```

### Stop loading after load error

```ts
class Loader extends EnvironmentLoader implements OnAfterError {
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<LoaderSource>
  ) {
    super(service, sources);
  }

  onAfterError(): void {
    this.onDestroy();
  }
}
```
