# Environment Query

> Gets the properties from the environment.

This application is the way to get the environment values. The base implementation can be directly instantiated or customized by creating a custom inherit class that overrides the methods.

```js
import { createEnvironmentQuery } from '@kuoki/environment';
import { store } from '...';

const query = createEnvironmentQuery(store);
const query = createEnvironmentQuery(store, { transpileEnvironment: true, interpolation: ['[[', ']]'] });
```

```js
import { EnvironmentQuery } from '@kuoki/environment';
import { store } from '...';

const query = new EnvironmentQuery(store);
const query = new EnvironmentQuery(store, { transpileEnvironment: true, interpolation: ['[[', ']]'] });
```

```ts
import { EnvironmentQuery, EnvironmentQueryConfig, EnvironmentStore } from '@kuoki/environment';

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

Returns a default value if undefined.

```js
// Environment = {}-{a:0}-{a:1}-{b:0}-
query.get$('a', { defaultValue: 9 }); // 9-0-1-9-
query.getAsync('a', { defaultValue: 9 }); // resolves 9 at 0ms
query.get('a', { defaultValue: 9 }); // 9
```

Converts the returned value to a target type.

```js
// Environment = {}-{a:0}-{a:1}-{b:0}-
query.get$('a', { targetType: String }); // 'undefined'-'0'-'1'-'undefined'-
query.getAsync('a', { targetType: String }); // resolves '0' at 2ms
query.get('a', { targetType: String }); // 'undefined'
```

Transpiles the resturned value.

```js
// Environment = {a:'Hello {{name}}'}-
query.get$('a', { transpile: { name: 'John' } }); // 'Hello John'-
query.getAsync('a', { transpile: { name: 'John' } }); // resolves 'Hello John' at 0ms
query.get('a', { transpile: { name: 'John' } }); // 'Hello John'
```

Transpiles using the environment values.

```js
// Environment = {a:'Hello {{name}}', name:'John'}-
query.get$('a', { transpile: {}, transpileEnvironment: true }); // 'Hello John'-
query.getAsync('a', { transpile: {}, transpileEnvironment: true }); // resolves 'Hello John' at 0ms
query.get('a', { transpile: {}, transpileEnvironment: true }); // 'Hello John'
```

When transpiles, the local properties has preferences over environment.

```js
// Environment = {a:'Hello {{name}}', name:'John'}-
query.get$('a', { transpile: { name: 'Thomas' }, transpileEnvironment: true }); // 'Hello Thomas'-
query.getAsync('a', { transpile: { name: 'Thomas' }, transpileEnvironment: true }); // resolves 'Hello Thomas' at 0ms
query.get('a', { transpile: { name: 'Thomas' }, transpileEnvironment: true }); // 'Hello Thomas'
```

Can change the interpolation characters.

```js
// Environment = {a:'Hello //name//'}-
query.get$('a', { transpile: { name: 'John', interpolation: ['//', '//'] } }); // 'Hello John'-
query.getAsync('a', { transpile: { name: 'John', interpolation: ['//', '//'] } }); // resolves 'Hello John' at 0ms
query.get('a', { transpile: { name: 'John', interpolation: ['//', '//'] } }); // 'Hello John'
```

The `transpileEnvironment` and `interpolation` properties can be configured at query application level when instantiated, but the local options have preference over the application ones.

```js
// Environment = {a:'Hello //name//', name:'John'}-
const query = createEnvironmentQuery(store, { transpileEnvironment: true, interpolation: ['//', '//'] });
query.get$('a', { transpile: {} }); // 'Hello John'-
query.getAsync('a', { transpile: {} }); // resolves 'Hello John' at 0ms
query.get('a', { transpile: {} }); // 'Hello John'
```
