# Loader Source

> The source with all the default values used by the loader.

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#loadersourcefactory">loaderSourceFactory</a></li>
    <li><a href="#loadersourcesfactory">loaderSourcesFactory</a></li>
    <li><a href="#errors">Errors</a></li>
  </ol>
</details>

### loaderSourceFactory

The default values are:

```js
{
  id: 'random id',
  isRequired: false,
  isOrdered: false,
  ignoreError: false,
  strategy: SourceStrategy.ADD,
};
```

```js
loaderSourceFactory({ load: () => [{}] });
// {
//   id: '1fvtjeqav0.fpjcvk57vno',
//   isRequired: false,
//   isOrdered: false,
//   ignoreError: false,
//   strategy: SourceStrategy.ADD,
//   load: () => [{}]
// }
```

```js
const source = {
  id: 'a',
  isRequired: true,
  isOrdered: true,
  ignoreError: true,
  strategy: SourceStrategy.MERGE,
  path: 'a',
  load: () => [{}]
};
loaderSourceFactory(source);
// {
//   id: 'a',
//   isRequired: true,
//   isOrdered: true,
//   ignoreError: true,
//   strategy: SourceStrategy.MERGE,
//   path: 'a',
//   load: () => [{}]
// }
```

```js
loaderSourceFactory({ load: 0 }); // throws InvalidSourceError
```

### loaderSourcesFactory

```js
const source1 = { load: () => [{ a: 0 }] };
loaderSourcesFactory(source1);
// [{
//   id: '1fvtjeqav0.fpjcvk57vno',
//   isRequired: false,
//   isOrdered: false,
//   ignoreError: false,
//   strategy: SourceStrategy.ADD,
//   load: () => [{a:0}]
// }]
```

```js
const source1 = { load: () => [{ a: 0 }] };
const source2 = { load: () => [{ a: 1 }] };
loaderSourcesFactory([source1, source2]);
// [{
//   id: '1fvtjeqav0.fpjcvk57vno',
//   isRequired: false,
//   isOrdered: false,
//   ignoreError: false,
//   strategy: SourceStrategy.ADD,
//   load: () => [{a:0}]
// },
// {
//   id: '1fvtjfh8q0.tnprppqrf3g',
//   isRequired: false,
//   isOrdered: false,
//   ignoreError: false,
//   strategy: SourceStrategy.ADD,
//   load: () => [{a:1}]
// }]
```

```js
loaderSourcesFactory({ load: 0 }); // throws InvalidSourceError
```

```js
const source1 = { id: 'a', load: () => [{ a: 0 }] };
const source2 = { id: 'a', load: () => [{ a: 1 }] };
loaderSourcesFactory([source1, source2]); // throws DuplicatedSourcesError
```

### Errors

```js
new DuplicatedSourcesError(['a', 'b']); // There are sources with duplicate id's: a, b
```
