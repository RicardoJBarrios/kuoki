# Environment Query

> Gets the properties from the environment.

This application is the way to get the environment values. The base implementation can be directly instantiated or customized by creating a custom inherit class that overrides the methods.

```js
const query = createEnvironmentQuery(store);
```

```js
const query = new EnvironmentQuery(store);
```

```ts
class CustomEnvironmentQuery extends EnvironmentQuery {
  constructor(
    protected override readonly store: EnvironmentStore,
    protected override readonly queryConfig?: EnvironmentQueryConfig
  ) {
    super(store, queryConfig);
  }
}
```

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#"></a></li>
  </ol>
</details>

###
