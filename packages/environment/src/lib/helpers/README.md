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
