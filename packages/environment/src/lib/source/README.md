# Environment Source

> The source from which to get environment properties asynchronously.

An Environment Source is a Gateway that must be implemented to obtain environment properties from different sources synchronously or asynchronously.
How these sources are resolved or how they add the properties to the environment can be defined by the source properties,
and an application can load one or as many sources as needed.

```js
const fileSource = {
  load: async () => fetch('environment.json')
};
```

```ts
class FileSource implements EnvironmentSource {
  constructor(private http: HttpClient) {}

  load(): Observable<EnvironmentState> {
    return this.http.get('environment.json');
  }
}
```

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#uses-of-requiredtoload">Uses of requiredToLoad</a></li>
    <li><a href="#uses-of-loadinorder">Uses of loadInOrder</a></li>
    <li><a href="#uses-of-ignoreerror">Uses of ignoreError</a></li>
    <li><a href="#fallback-sources">Fallback sources</a></li>
    <li><a href="#sources-for-long-lived-observables">Sources for Long-lived Observables</a></li>
  </ol>
</details>

### Uses of requiredToLoad

The `requiredToLoad` property can mark a source as required. The `load()` method will return after all sources are resolved.

```js
const firstSource = {
  requiredToLoad: true,
  load: () => of({ a: 0 }).pipe(delay(10))
};
const secondSource = {
  requiredToLoad: true,
  load: () => of({ b: 0 }).pipe(delay(20))
};
loader.load(); // resolves at 20 ms
// sets the firstSource properties at 10 ms
// sets the secondSource properties at 20 ms
```

If there is no required to load sources the loader will resolve immedialely.

```js
const noRequiredSource = { load: () => of({ a: 0 }).pipe(delay(10)) };
loader.load(); // resolves immedialely
// sets the noRequiredSource properties at 10 ms
```

If a required to load source never completes the loader will never resolve.

```js
const infiniteSource = {
  requiredToLoad: true,
  load: () => interval(10).pipe(map((v) => ({ a: v })))
};
loader.load(); // will never resolve
// sets the infiniteSource properties every 10 ms
```

The loader will reject after a required to load source error.

```js
const firstSource = {
  requiredToLoad: true,
  load: () => throwError(() => new Error())
};
const secondSource = {
  requiredToLoad: true,
  load: () => of({ b: 0 }).pipe(delay(20))
};
loader.load(); // rejects immedialely
// sets the secondSource properties at 20 ms
```

The loader will resolves normally after a no required to load source error.

```js
const firstSource = { load: () => throwError(() => new Error()) };
const secondSource = {
  requiredToLoad: true,
  load: () => of({ b: 0 }).pipe(delay(20))
};
loader.load(); // resolves at 20 ms
// sets the secondSource properties at 20 ms
```

### Uses of loadInOrder

The `loadInOrder` property defined if a source must wait for another one to complete to start the loading of properties.

```js
const firstSource = {
  loadInOrder: true,
  load: () => of({ a: 0 }, { a: 1 }, { a: 2 }).pipe(delay(10))
};
const secondSource = {
  loadInOrder: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves immediately
// sets the firstSource properties at 10 ms, 20 ms & 30ms
// sets the secondSource properties at 40 ms
```

The not loadInOrder sources will add properties all at once.

```js
const firstSource = { load: () => of({ a: 0 }).pipe(delay(10)) };
const secondSource = { load: () => of({ b: 0 }).pipe(delay(10)) };
loader.load(); // resolves immediately
// sets the firstSource properties at 10 ms
// sets the secondSource properties at 10 ms
```

If a loadInOrder source never completes will never set the next ordered source properties.

```js
const infiniteSource = {
  loadInOrder: true,
  load: () => interval(10).pipe(map((v) => ({ a: v })))
};
const secondSource = {
  loadInOrder: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves immediately
// sets the infiniteSource properties every 10 ms
// never sets the secondSource properties
```

If a loadInOrder source returns an error will be ignored and will continue with the next ordered source.

```js
const firstSource = {
  loadInOrder: true,
  load: () => throwError(() => new Error())
};
const secondSource = {
  loadInOrder: true,
  load: () => of({ b: 0 }).pipe(delay(10))
};
loader.load(); // resolves immediately
// sets the secondSource properties at 10 ms
```

### Uses of ignoreError

If a required to load source throws an error the loader will rejects, but if the `ignoreError` property is set to `true` the error will be ignored as a no required to load source error.

```js
const firstSource = {
  requiredToLoad: true,
  ignoreError: true,
  load: () => throwError(() => new Error())
};
const secondSource = {
  requiredToLoad: true,
  load: () => of({ b: 0 }).pipe(delay(20))
};
loader.load(); // resolves at 20 ms
// sets the secondSource properties at 20 ms
```

### Fallback sources

Sometimes is needed to provide a fallback source if the first one fails. This can be done easily in the original
properties source with the `catch` method or the `catchError` operator function.
This condition can be chained as many times as necessary.

```js
const fileSource = {
  load: async () => fetch('environment.json').catch(() => fetch('environment2.json'))
};
```

```ts
class FileSource implements EnvironmentSource {
  constructor(private http: HttpClient) {}

  load(): Observable<EnvironmentState> {
    return this.http.get('environment.json').pipe(catchError(() => this.http.get('environment2.json')));
  }
}
```

### Sources for Long-lived Observables

If the application needs to load the properties from sources that emit multiple times asynchronously,
such as a webservice or a Server Sent Event (SSE) service, ensure that `loadInOrder` is `false` or is the
last source, because ordered sources must complete to let the next one start.

```ts
const serverSideEventSource = {
  loadInOrder: false,
  load: () => sse.get('https://api.com/sse')
};
```
