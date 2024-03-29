# Environment Query

> Gets the properties from the EnvironmentState.

This class provides multiple ways to consume EnvironmentState properties synchronously and asynchronously, plus other options like marking properties as required, interpolating values ​​in properties, etc. Typically this will be the class that is exposed to the rest of the application to get the properties.

The environment query is an interface that must be implemented to get the environment values. Can be integrated into any application using the provided default implementation or a custom one.

```ts
import { EnvironmentQuery } from '@kuoki/environment';

class CustomEnvironmentQuery implements EnvironmentQuery {
  // ...implement environment query interface
}

const environmentQuery: EnvironmentQuery = new CustomEnvironmentQuery();
```

## DefaultEnvironmentQuery

A basic implementation that can be instantiated from...

1. A factory function.

```js
import { createEnvironmentQuery, createEnvironmentStore, EnvironmentQuery, EnvironmentStore } from '@kuoki/environment';

const environmentStore: EnvironmentStore = createEnvironmentStore();
const environmentQuery1: EnvironmentQuery = createEnvironmentQuery(environmentStore);

const queryConfig: EnvironmentQueryConfig = { transpileEnvironment: true, interpolation: ['[[', ']]'] };
const environmentQuery2: EnvironmentQuery = createEnvironmentQuery(environmentStore, queryConfig);
```

2. The newable class.

```js
import {
  DefaultEnvironmentQuery,
  DefaultEnvironmentStore,
  EnvironmentQuery,
  EnvironmentStore
} from '@kuoki/environment';

const environmentStore: EnvironmentStore = new DefaultEnvironmentStore();
const environmentQuery1: EnvironmentQuery = new DefaultEnvironmentQuery(environmentStore);

const queryConfig: EnvironmentQueryConfig = { transpileEnvironment: true, interpolation: ['[[', ']]'] };
const environmentQuery2: EnvironmentQuery = new DefaultEnvironmentQuery(environmentStore, queryConfig);
```

3. A class that extends `DefaultEnvironmentQuery`.

```ts
import { DefaultEnvironmentQuery, EnvironmentStore } from '@kuoki/environment';

class CustomEnvironmentQuery extends DefaultEnvironmentQuery {
  constructor(
    protected override readonly store: EnvironmentStore,
    protected override readonly queryConfig?: EnvironmentQueryConfig
  ) {
    super(store, queryConfig);
  }
  // ...override implementation
}

const environmentStore: EnvironmentStore = new DefaultEnvironmentStore();
const environmentQuery1: EnvironmentQuery = new CustomEnvironmentQuery(environmentStore);

const queryConfig: EnvironmentQueryConfig = { transpileEnvironment: true, interpolation: ['[[', ']]'] };
const environmentQuery1: EnvironmentQuery = new CustomEnvironmentQuery(environmentStore, queryConfig);
```

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#getall">getAll</a></li>
    <li><a href="#containsall">containsAll</a></li>
    <li><a href="#containssome">containsSome</a></li>
    <li><a href="#get">get</a></li>
    <li><a href="#first-not-nil-observable">First not nil Observable</a></li>
    <li><a href="#errors">Errors</a></li>
  </ol>
</details>

### getAll

Gets all the EnvironmentState properties.

```js
// Environment = ^{}-{a:0}-{a:0}-{a:1}-
query.getAll$(); // ^{}-{a:0}---{a:1}-
query.getAllAsync(); // resolves {a:0} at 20ms
query.getAll(); // {}
```

### containsAll

Checks if all the EnvironmentState property paths are available for resolution.

```js
// Environment = ^{}-{a:0}-{a:0}-{a:1,b:0}-
query.containsAll$('a', 'b'); // ^false-----true-
query.containsAllAsync('a', 'b'); // resolves true at 60ms
query.containsAll('a', 'b'); // false
```

### containsSome

Checks if some EnvironmentState property paths are available for resolution.

```js
// Environment = ^{}-{a:0}-{a:0}-{b:0}-
query.containsSome$('a', 'c'); // ^false-true---false-
query.containsSomeAsync('a', 'c'); // resolves true at 20ms
query.containsSome('a', 'c'); // false
```

### get

Gets the EnvironmentState property value.

```js
// Environment = ^{}-{a:0}-{a:1}-{b:0}-
query.get$('a'); // ^undefined-0-1-undefined-
query.getAsync('a'); // resolves 0 at 20ms
query.get('a'); // undefined
```

Return a default value if undefined.

```js
// Environment = ^{}-{a:0}-{a:1}-{b:0}-
query.get$('a', { defaultValue: 9 }); // ^9-0-1-9-
query.getAsync('a', { defaultValue: 9 }); // resolves 9 at 0ms
query.get('a', { defaultValue: 9 }); // 9
```

Convert the returned value to a target type.

```js
// Environment = ^{}-{a:0}-{a:1}-{b:0}-
query.get$('a', { targetType: String }); // ^'undefined'-'0'-'1'-'undefined'-
query.getAsync('a', { targetType: String }); // resolves '0' at 20ms
query.get('a', { targetType: String }); // 'undefined'
```

Return the async value on due time.

```js
// Environment = ^{}-{a:0}-{a:1}-{b:0}-
query.getAsync('b', { dueTime: 100 }); // resolves 0 at 60ms
query.getAsync('b', { dueTime: 20 }); // resolves undefined at 20ms
```

Throws an `EnvironmentReferenceError` if the property is required.

```js
// Environment = ^{}-{a:0}-{a:1}-{b:0}-
query.get('z', { required: false }); // undefined
query.get('z', { required: true }); // throws EnvironmentReferenceError
// 'The environment property "z" is not defined'
```

Transpile the returned value.

```js
// Environment = ^{a:'Hello {{name}}'}-
query.get$('a', { transpile: { name: 'John' } }); // ^'Hello John'-
query.getAsync('a', { transpile: { name: 'John' } }); // resolves 'Hello John' at 0ms
query.get('a', { transpile: { name: 'John' } }); // 'Hello John'
```

Transpile using the environment values.

```js
// Environment = ^{a:'Hello {{name}}', name:'John'}-
const config = { transpileEnvironment: true };
query.get$('a', { transpile: {}, config });
// ^'Hello John'-
query.getAsync('a', { transpile: {}, config });
// resolves 'Hello John' at 0ms
query.get('a', { transpile: {}, config });
// 'Hello John'
```

When transpile, the local properties has preferences over environment.

```js
// Environment = ^{a:'Hello {{name}}', name:'John'}-
const config = { transpileEnvironment: true };
query.get$('a', { transpile: { name: 'Thomas' }, config });
// ^'Hello Thomas'-
query.getAsync('a', { transpile: { name: 'Thomas' }, config });
// resolves 'Hello Thomas' at 0ms
query.get('a', { transpile: { name: 'Thomas' }, config });
// 'Hello Thomas'
```

Can change the interpolation characters.

```js
// Environment = ^{a:'Hello //name//'}-
const config: { interpolation: ['//', '//'] };
query.get$('a', { transpile: { name: 'John' }, config });
// ^'Hello John'-
query.getAsync('a', { transpile: { name: 'John' }, config });
// resolves 'Hello John' at 0ms
query.get('a', { transpile: { name: 'John' }, config });
// 'Hello John'
```

The `transpileEnvironment` and `interpolation` properties can be configured at query application level when instantiated, but the local options have preference over the application ones.

```js
// Environment = ^{a:'Hello [[name]]', name:'John'}-
query2.get$('a', { transpile: {} }); // ^'Hello John'-
query2.getAsync('a', { transpile: {} }); // resolves 'Hello John' at 0ms
query2.get('a', { transpile: {} }); // 'Hello John'
```

```js
// Environment = ^{a:'Hello //name//', name:'John'}-
const config: { interpolation: ['//', '//'] };
query2.get$('a', { transpile: { name: 'Sara' }, config });
// ^'Hello Sara'-
query2.getAsync('a', { transpile: { name: 'Sara' }, config });
// resolves 'Hello Sara' at 0ms
query2.get('a', { transpile: { name: 'Sara' }, config });
// 'Hello Sara'
```

### First not nil Observable

if you want to get the first not nil value on a time period using RxJS observables you can do it using `filterNil()` and the RxJS
[take](https://rxjs.dev/api/operators/take) and [timeout](https://rxjs.dev/api/operators/timeout) operators.

```js
// observable = -null-undefined-0-1-2-
query.get$('a').pipe(filterNil(), take(1), timeout(100)).subscribe(); // -----(0|)
query.get$('a').pipe(filterNil(), take(1), timeout(2)).subscribe(); // --# TimeoutError
```

### Errors

```js
new EnvironmentReferenceError(path); // The environment property "a" is not defined
```
