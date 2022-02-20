# Environment Source

> The source from which to get environment properties.

An Environment Source is a Gateway that must be implemented to obtain environment properties from different sources. How these sources are resolved or how they add the properties to the environment can be defined by the source properties.

```js
const fileSource = {
  load: async () => fetch('env.json')
};
```

```ts
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '...';

class FileSource implements EnvironmentSource {
  constructor(protected readonly http: HttpClient) {}

  load(): Observable<EnvironmentState> {
    return this.http.get('env.json');
  }
}
```

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#isrequired">isRequired</a></li>
    <li><a href="#isordered">isOrdered</a></li>
    <li><a href="#ignoreerror">ignoreError</a></li>
    <li><a href="#load">load()</a></li>
    <li><a href="#fallback-sources">Fallback sources</a></li>
  </ol>
</details>

### isRequired

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

### load()

```js
const source1 = { load: () => Promise.resolve({ a: 0 }) };
const source2 = { load: () => of({ a: 0 }) };
const source3 = { load: () => [{ a: 0 }] };
```

### Fallback sources

Sometimes is needed to provide a fallback source if the first one fails. This can be done easily in the original
source with the `catch` method or the `catchError` operator function.
This condition can be chained as many times as necessary.

```js
const fileSource = {
  load: async () => fetch('env-prod.json').catch(() => fetch('env.json'))
};
```

```ts
import { EnvironmentSource, EnvironmentState } from '@kuoki/environment';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '...';

class FileSource implements EnvironmentSource {
  constructor(private http: HttpClient) {}

  load(): Observable<EnvironmentState> {
    return this.http.get('env-prod.json').pipe(catchError(() => this.fallbackSource()));
  }

  private fallbackSource(): Observable<EnvironmentState> {
    return this.http.get('env.json');
  }
}
```
