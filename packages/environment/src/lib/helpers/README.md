# Environment Helpers

> Helper functions

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#"></a></li>
  </ol>
</details>

### First not nil Observable

if you want to mimic `asyncNotNil()` behavior using RxJS observables you can do it using `filterNil()` and the RxJS
[take](https://rxjs.dev/api/operators/take) and [timeout](https://rxjs.dev/api/operators/timeout) operators.

```js
// observable = -null-undefined-0-1-2-
observable.pipe(filterNil(), take(1), timeout(100)).subscribe(); // -----(0|)
observable.pipe(filterNil(), take(1), timeout(2)).subscribe(); // --# TimeoutError
```
