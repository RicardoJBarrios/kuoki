# Environment Source

> Source from which to get environment properties.

An EnvironmentSource is a service from which to fetch environment variables into a browser synchronously or asynchronously. It can be a constant, a file, a browser storage, a property server, a WebSocket stream or any other type of source that the browser has access to.

An application can have as many sources as it needs, and they all have access to the EnvironmentState to build calls, wait for specific properties or other sources, etc. How these sources are resolved or how they add the properties to the environment can be defined by the source properties.

The EnvironmentSource is an interface that must be implemented to obtain environment properties.

```ts
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';

class FileSource implements EnvironmentSource {
  // ...implement environment source interface
}
```

## Use cases

Below are examples of the expected behavior with the default environment loader implementation.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#isrequired">isRequired</a></li>
    <li><a href="#isordered">isOrdered</a></li>
    <li><a href="#ignoreerror">ignoreError</a></li>
    <li><a href="#path">path</a></li>
    <li><a href="#load">load()</a></li>
    <li><a href="#mapfn">mapFn()</a></li>
    <li><a href="#errorhandler">errorHandler()</a></li>
    <li><a href="#fallback-sources">Fallback sources</a></li>
    <li><a href="#use-values-from-other-sources">Use values from other sources</a></li>
    <li><a href="#errors">Errors</a></li>
  </ol>
</details>

### isRequired

This property marks the properties loaded by the EnvironmentSource as required. So must be loaded before the application load and should stop the load if there is an error.

```js
const source1 = {
  isRequired: true,
  load: () => of({ a: 0 }).pipe(delay(10))
};
const source2 = {
  isRequired: true,
  load: () =>
    interval(10).pipe(
      map((v) => ({ b: v })),
      take(3)
    )
};
loader.load(); // resolves at 30ms
// sets the source1 properties at 10ms
// sets the source2 properties at 10ms, 20ms & 30ms
```

Resolves immedialely if there is no required sources.

```js
const source1 = { load: () => of({ a: 0 }).pipe(delay(10)) };
loader.load(); // resolves immedialely
// sets the source1 properties at 10ms
```

Never resolves if a required source doesn't complete.

```js
const source1 = {
  isRequired: true,
  load: () => interval(10).pipe(map((v) => ({ a: v })))
};
loader.load(); // will never resolve
// sets the source1 properties every 10ms
```

Rejects after a required source error.

```js
const source1 = {
  isRequired: true,
  load: () => throwError(() => new Error())
};
const source2 = {
  isRequired: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // rejects immedialely
// sets the source2 properties at 10ms
```

Resolves after a no required source error.

```js
const source1 = { load: () => throwError(() => new Error()) };
const source2 = {
  isRequired: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves at 10ms
// sets the source2 properties at 10ms
```

### isOrdered

Forces the checked properties to load in order, waiting for one to finish loading before starting the next.

```js
const source1 = {
  isOrdered: true,
  load: () =>
    interval(10).pipe(
      map((v) => ({ a: v })),
      take(3)
    )
};
const source2 = {
  isOrdered: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves immediately
// sets the source1 properties at 10ms, 20ms & 30ms
// sets the source2 properties at 40ms
```

Unordered sources add all properties at once.

```js
const source1 = { load: () => of({ a: 0 }).pipe(delay(10)) };
const source2 = { load: () => of({ b: 0 }).pipe(delay(10)) };
loader.load(); // resolves immediately
// sets the source1 properties at 10ms
// sets the source2 properties at 10ms
```

Never loads if previous ordered source doesn't complete.

```js
const source1 = {
  isOrdered: true,
  load: () => interval(10).pipe(map((v) => ({ a: v })))
};
const source2 = {
  isOrdered: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves immediately
// sets the infiniteSource properties every 10ms
// never sets the source2 properties
```

Ignore errors and continues with the next ordered source.

```js
const source1 = {
  isOrdered: true,
  load: () => throwError(() => new Error())
};
const source2 = {
  isOrdered: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves immediately
// sets the source2 properties at 10ms
```

### ignoreError

Ignores required source errors so that you can continue to load the application.

```js
const source1 = {
  isRequired: true,
  ignoreError: true,
  load: () => throwError(() => new Error())
};
const source2 = {
  isRequired: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves at 10ms
// sets the source2 properties at 10ms
```

### path

The EnvironmentState path in which to save the properties of this source.

```js
const source1 = { path: 'a'; load: () => [{ a: 0 }] };
loader.load(); // resolves at 0ms
// sets the source1 properties at 0ms with {a:{a:0}}
```

### load()

The method that gets the sources.

```js
const source1 = { load: () => Promise.resolve({ a: 0 }) };
const source2 = { load: () => of({ a: 0 }) };
const source3 = { load: () => [{ a: 0 }] };
const source4 = { load: () => ({ a: 0 }) };
```

### mapFn()

A function that's executed before `EnvironmentLoader#preAddProperties()` that allows to modify the loaded properties.

```js
const source = {
  load: () => of({ a: 0 }),
  mapFn: (properties) => ({ ...properties, b: 0 })
};
loader.load(); // resolves at 0ms
// sets source properties at 0ms with {a:0,b:0}
```

### errorHandler()

Returns an EnvironmentState on error.

```js
const source = {
  load: () => throwError(() => new Error()),
  errorHandler: () => ({ a: 0 })
};
loader.load(); // resolves at 0ms
// sets source properties at 0ms with {a:0}
```

Execute aside code and return the same error.

```js
const source = {
  id: 'source',
  isRequired: true,
  load: () => throwError(() => new Error('original')),
  errorHandler: (error) => {
    console.log(error);
    throw error;
  }
};
loader.load(); // rejects at 0ms
// LOG ERROR 'original'
// ERROR The environment source "source" failed to load: original
```

Return a custom error.

```js
const source = {
  id: 'source',
  isRequired: true,
  load: () => throwError(() => new Error('original')),
  errorHandler: () => {
    throw new Error('new');
  }
};
loader.load(); // rejects at 0ms
// ERROR The environment source "source" failed to load: new
```

### Fallback sources

Sometimes is needed to provide a fallback source if the first one fails. This can be done easily in the original source with the `catch` method or the `catchError` operator function. This condition can be chained as many times as necessary.

1. Using `catch` with `Promise`.

```js
const fileSource = {
  load: async () =>
    fetch('env-prod.json')
      .then((response) => response.json())
      .catch(() => fetch('env.json').then((response) => response.json()))
};
```

2. Using `catchError` with `Observable`.

```ts
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '...';

class FileSource implements EnvironmentSource {
  constructor(protected readonly http: HttpClient) {}

  load(): Observable<EnvironmentState> {
    return this.http.get('env-prod.json').pipe(catchError(() => this.http.get('env.json')));
  }
}
```

### Use values from other sources

```js
// env.json = { basePath: 'https://myapi.com/api' }
const source1 = {
  load: async () => fetch('env.json').then((response: Response) => response.json())
};
const source2 = {
  load: async () => {
    const basePath: string = await query.getAsync('basePath');
    return fetch(`${basePath}/resource`).then((response: Response) => response.json());
  }
};
loader.load();
// sets basePath with source1
// waits for source1 to use basePath to load source2
```

### Errors

```js
new InvalidSourceError(source); // The source "a" is invalid
```
