# Environment Helpers

> Helper types and functions.

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#mutable">mutable()</a></li>
    <li><a href="#filternil">filterNil()</a></li>
    <li><a href="#aserror">asError()</a></li>
    <li><a href="#asstring">asString()</a></li>
    <li><a href="#delayedpromise">delayedPromise()</a></li>
    <li><a href="#ifdefined">ifDefined()</a></li>
  </ol>
</details>

### mutable()

```js
mutable(Object.freeze({ a: 0 })); // {a:0}
mutable('a'); // 'a'
```

### filterNil()

```js
// observable = -null-undefined-0-1-2-
observable.pipe(filterNil()).subscribe(); // -----0-1-2-
```

### asError()

```js
const error = new Error('a');
asError(error); // new Error('a')
asError('a'); // new Error('a')
```

### asString()

```js
asString({ a: 0 }); // '{"a":0}'
asString({ a: () => ({ a: 0 }) }); // '{"a":"() => ({ a: 0 })"}'
asString([0, 'a', null, true]); // '[0,"a",null,true]'
asString([{ a: 0 }]); // '[{"a":0}]'
```

### delayedPromise()

```js
delayedPromise('a', 10); // Promise resolves 'a' after 10ms
```

### ifDefined()

Executes an assertion if the value is not nil. If the value is nil returns true.

```js
ifDefined(value?.id, typeof value?.id === 'string');
```
