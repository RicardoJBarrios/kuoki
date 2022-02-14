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
    <li><a href="#getall">getAll</a></li>
    <li><a href="#containsall">containsAll</a></li>
    <li><a href="#containssome">containsSome</a></li>
    <li><a href="#get">get</a></li>
  </ol>
</details>

### getAll

```js
// Environment = {}-{a:0}-{a:0}-{a:1}-
query.getAll$(); // {}-{a:0}---{a:1}-
query.getAllAsync(); // resolves {a:0} at 2ms
query.getAll(); // {}
```

### containsAll

```js
// Environment = {}-{a:0}-{a:0}-{a:1,b:0}-
query.containsAll$('a', 'b'); // false-----true-
query.containsAllAsync('a', 'b'); // resolves true at 6ms
query.containsAll('a', 'b'); // false
```

### containsSome

```js
// Environment = {}-{a:0}-{a:0}-{b:0}-
query.containsSome$('a', 'c'); // false-true---false-
query.containsSomeAsync('a', 'c'); // resolves true at 2ms
query.containsSome('a', 'c'); // false
```

### get

```js
// Environment = {}-{a:0}-{a:1}-{b:0}-
query.get$('a'); // undefined-0-1-undefined-
query.getAsync('a'); // resolves 0 at 2ms
query.get('a'); // undefined
```

Return a default value if undefined.

```js
// Environment = {}-{a:0}-{a:1}-{b:0}-
query.get$('a', { defaultValue: 9 }); // 9-0-1-9-
query.getAsync('a', { defaultValue: 9 }); // resolves 9 at 0ms
query.get('a', { defaultValue: 9 }); // 9
```

Convert the returned value.

```js
// Environment = {}-{a:0}-{a:1}-{b:0}-
query.get$('a', { targetType: String }); // 'undefined'-'0'-'1'-'undefined'-
query.getAsync('a', { targetType: String }); // resolves '0' at 2ms
query.get('a', { targetType: String }); // 'undefined'
```
