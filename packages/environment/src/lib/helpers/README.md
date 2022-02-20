# Environment Helpers

> Helper types and functions.

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#"></a></li>
  </ol>
</details>

### Mutable

```js
mutable(Object.freeze({ a: 0 })); // {a:0}
mutable('a'); // 'a'
```

### Filter Nil

```js
// observable = -null-undefined-0-1-2-
observable.pipe(filterNil()).subscribe(); // -----0-1-2-
```

### Async not Nil

```js
// observable = -null-undefined-0-1-2-
asyncNotNil(Promise.resolves(0)); // Promise resolves 0
asyncNotNil([null, undefined, 0, 1, 2]); // Promise resolves 0
asyncNotNil(observable); // Promise resolves 0
asyncNotNil(observable, 100); // Promise resolves 0
asyncNotNil(observable, 1); // Promise rejects TimeoutError
asyncNotNil([null, undefined]); // Promise rejects EmptyError
```

### First not nil Observable

if you want to mimic `asyncNotNil()` behavior using RxJS observables you can do it using `filterNil()` and the RxJS
[take](https://rxjs.dev/api/operators/take) and [timeout](https://rxjs.dev/api/operators/timeout) operators.

```js
// observable = -null-undefined-0-1-2-
observable.pipe(filterNil(), take(1), timeout(100)).subscribe(); // -----(0|)
observable.pipe(filterNil(), take(1), timeout(2)).subscribe(); // --# TimeoutError
```
