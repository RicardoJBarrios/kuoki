# Anymap

> A helper class for testing use cases where the value is of type any

[![npm](https://img.shields.io/npm/v/@kuoki/anymap?logo=npm&style=flat-square)](https://www.npmjs.com/package/@kuoki/anymap)
[![Documentation](https://img.shields.io/badge/documentation-done-blue?style=flat-square)](https://ricardojbarrios.github.io/kuoki/anymap/)
[![Coverage](https://img.shields.io/sonar/coverage/kuoki-anymap/master?server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://ricardojbarrios.github.io/kuoki/anymap/coverage/)
[![Quality Gate Status](https://img.shields.io/sonar/quality_gate/kuoki-anymap?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://sonarcloud.io/project/overview?id=kuoki-anymap)
[![GitHub](https://img.shields.io/github/license/ricardojbarrios/kuoki?style=flat-square)](https://github.com/RicardoJBarrios/kuoki/blob/main/LICENSE.md)
[![GitHub issues anymap](https://img.shields.io/github/issues/ricardojbarrios/kuoki/anymap?logo=github&label=issues&style=flat-square)](https://github.com/RicardoJBarrios/kuoki/labels/anymap)

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## About The Project

The `Anymap` object is useful to test functions or methods that uses arguments with the types `any` or `undefined` because contains all the standard JavaScript data types in a dictionary, allowing filtering them using the data type keys or using a filter function. In this way, the code can be strengthened by testing all existing types and their behavior.

## Getting Started

### Installation

Using NPM

```sh
npm install --save-dev @kuoki/anymap
```

Using Yarn

```sh
yarn add --dev @kuoki/anymap
```

## Usage

Create an instace of Anymap and use the methods to chain operations to get the desired result.

```js
const objectValues = new Anymap().exclude('null').filter((value) => typeof value === 'object').values;
```

The class exposes four types of ways to get the final desired data.
The `dictionary` is a plain object with the key and the list of values that represents.

```js
type dictionary = Record<string, any[]>;
```

```js
const anymap = new Anymap().include('boolean', 'null');
anymap.dict; // {boolean:[true,false],null:[null]}
anymap.keys; // ['boolean','null']
anymap.values; // [true,false,null]
anymap.entries; // [['boolean':true],['boolean':false],['null',null]]
```

### Available keys

`anonymousFunction`, `Array`, `ArrayBuffer`, `Atomics`, `BigInt64Array`, `bigint`, `BigUint64Array`, `binary`, `Boolean`, `DataView`, `Date`, `decimal`, `Document`, `DocumentFragment`, `Element`, `Error`, `EvalError`, `Event`, `exponent`, `Float32Array`, `Float64Array`, `hexadecimal`, `Infinity`, `Int16Array`, `Int32Array`, `Int8Array`, `integer`, `JSON`, `Map`, `Math`, `namedFunction`, `namedObject`, `NaN`, `null`, `Number`, `octal`, `plainObject`, `RangeError`, `ReferenceError`, `RegExp`, `Set`, `SharedArrayBuffer`, `string`, `String`, `Symbol`, `SyntaxError`, `TypeError`, `Uint16Array`, `Uint32Array`, `Uint8Array`, `Uint8ClampedArray`, `undefined`, `URIError`, `WeakMap`, `WeakSet`, `Window`,`boolean`

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#add">Add</a></li>
    <li><a href="#clear">Clear</a></li>
    <li><a href="#include">Include</a></li>
    <li><a href="#exclude">Exclude</a></li>
    <li><a href="#union">Union</a></li>
    <li><a href="#except">Except</a></li>
    <li><a href="#filter">Filter</a></li>
    <li><a href="#intersect">Intersect</a></li>
    <li><a href="#use-in-a-test">Use in a test</a></li>
    <li><a href="#common-filters">Common filters</a></li>
  </ol>
</details>

### Add

```ts
new Anymap().include('string').add({ string: [' '] }).dict;
// {string:['',' ']}
new Anymap().include('null').add({ myObject: [{ a: 'a' }] }).dict;
// {null:[null],myObject:[{a:'a'}]}
```

### Clear

```ts
new Anymap().include('null').dict;
// {null:[null]}
new Anymap().include('null').clear().dict;
// {}
```

### Include

```ts
new Anymap().include('null').dict;
// {null:[null]}
new Anymap().include('null', 'boolean').dict;
// {null:[null],boolean:[true,false]}
```

### Exclude

```ts
const test = new Anymap().include('null', 'boolean');

test.dict;
// {null:[null],boolean:[true,false]}
test.exclude('null').dict;
// {boolean:[true,false]}
```

### Union

```ts
const a = new Anymap().include('null');
const b = new Anymap().include('boolean');

a.union(b).dict;
// {null:[null],boolean:[true,false]}
```

### Except

```ts
const a = new Anymap().include('null', 'boolean');
const b = new Anymap().include('boolean');

a.except(b).dict;
// {null:[null]}
```

### Intersect

```ts
const a = new Anymap().include('null', 'boolean');
const b = new Anymap().include('boolean');

a.intersect(b).dict;
// {boolean:[true,false]}
```

### Filter

```ts
new Anymap().include('null', 'boolean').filter((value) => Boolean(value)).dict;
// {boolean:[true]}
```

### Use in a test

```ts
import { Anymap } from '@kuoki/anymap';

function isFalsy(arg: any): boolean {
  return Boolean(arg) === false;
}

describe('isFalsy', () => {
  const falsy = new Anymap().filter((v) => Boolean(v) === false);
  const truthy = new Anymap().except(falsy);

  falsy.entries.forEach(([key, value]) => {
    it(`isFalsy(${key} ${String(value)}) returns true`, () => {
      expect(isFalsy(value)).toEqual(true);
    });
  });

  truthy.entries.forEach(([key, value]) => {
    it(`isFalsy(${key} ${String(value)}) returns false`, () => {
      expect(isFalsy(value)).toEqual(false);
    });
  });
});
```

### Common filters

```js
import { Anymap } from '@kuoki/anymap';

const numbers = new Anymap().filter((value) => typeof value === 'number');
const falsies = new Anymap().filter((value) => Boolean(value) === false);
const iterables = new Anymap().filter((value) => typeof value[Symbol.iterator] === 'function');
```
