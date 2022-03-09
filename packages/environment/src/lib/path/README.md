# Environment Path

> Manages the path to an environment property.

The path is a property name, a dot-separated set of property names or an array of property names
that represents a path to get an environment value. Must be a sequence of ASCII characters that can contain
letters `a-zA-Z`, `$`, `_`, and digits `0-9`, but may not start with a digit.

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#ispath">isPath</a></li>
    <li><a href="#overwritespath">overwritesPath</a></li>
    <li><a href="#pathasarray">pathAsArray</a></li>
    <li><a href="#pathasstring">pathAsString</a></li>
  </ol>
</details>

### isPath

```js
isPath('a'); // true
isPath('a.a'); // true
isPath('a.a0'); // true
isPath('a.a$'); // true
isPath('a._a'); // true
isPath(['a', 'a']); // true
isPath(''); // false
isPath([]); // false
isPath('a.a-'); // false
isPath('2a'); // false
isPath(0); // false
isPath(['2a', 'a']); // false
```

### overwritesPath

```js
const environment = { a: { b: 0 } };
overwritesPath('a.b', environment); // true
overwritesPath('a.b.c.d', environment); // true
```

```js
const environment = { a: { b: {} } };
overwritesPath('a', environment); // false
overwritesPath('a.b.c', environment); // false
overwritesPath('a.b.c.d', environment); // false
```

### pathAsArray

```js
pathAsArray('a.a'); // ['a','a']
pathAsArray(['a', 'a']); // ['a','a']
```

### pathAsString

```js
pathAsString('a.a'); // 'a.a'
pathAsString(['a', 'a']); // 'a.a'
```