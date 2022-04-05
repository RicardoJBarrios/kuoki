# Lifecycle Hooks

An environment loader has a lifecycle that starts each time the load() method is invoked. Each lifecycle ends when the method returns. Your implementation can use lifecycle hook methods to tap into key events in the environment loader service.

Respond to events in the lifecycle of the loader by implementing one or more of the lifecycle hook interfaces presented. The hooks give you the opportunity to act on the instance at the appropriate moment.

Each interface defines the prototype for a single hook method, whose name is the interface name starting in lowercase. For example, the OnBeforeLoad interface has a hook method named onBeforeLoad().

You don't have to implement all (or any) of the lifecycle hooks, just the ones you need.

| Interface               | Lifecycle event                                         |
| ----------------------- | ------------------------------------------------------- |
| `OnBeforeLoad`          | Before start the environment sources load               |
| `OnBeforeSourceLoad`    | Before a source starts to load the properties           |
| `OnBeforeSourceAdd`     | Before a source properties are added to the environment |
| `OnAfterSourceAdd`      | After a source properties are added to the environment  |
| `OnAfterSourceComplete` | After a source completes                                |
| `OnAfterSourceError`    | After a source is rejected                              |
| `OnAfterComplete`       | After all environment sources completes                 |
| `OnAfterLoad`           | After the load is resolved                              |
| `OnAfterError`          | After the load is rejected                              |

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
  requiredProperties: Path[] = ['user.name', 'baseURL'];

  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<LoaderSource>,
    protected readonly query: EnvironmentQuery
  ) {
    super(service, sources);
  }

  onAfterSourceAdd(): void {
    if (this.query.containsAll(...this.requiredProperties)) {
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
