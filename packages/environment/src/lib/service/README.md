# Environment Service

> Sets properties in the environment store.

This application is the way to mutate the environment store. The base implementation can be directly instantiated or customized by creating a custom inherit class that overrides the methods. Each method returns an EnvironmentResult to make it easy to develop these customizations.

```js
const service = createEnvironmentService(store);
```

```js
const service = new EnvironmentService(store);
```

```ts
class CustomEnvironmentService extends EnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
}
```

## Use cases

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#reset">reset</a></li>
    <li><a href="#create">create</a></li>
    <li><a href="#update">update</a></li>
    <li><a href="#upsert">upsert</a></li>
    <li><a href="#delete">delete</a></li>
    <li><a href="#add">add</a></li>
    <li><a href="#merge">merge</a></li>
    <li><a href="#log-actions">Log actions</a></li>
  </ol>
</details>

### reset

```js
// EnvironmentState = {a:0}
service.reset(); // {code:205}
// EnvironmentState = {}
```

### create

```js
// EnvironmentState = {}
service.create('a', 0); // {code:201,path:'a',value:0}
// EnvironmentState = {a:0}
service.create('2a', 0); // {code:400,path:'2a',value:0}
// EnvironmentState = {a:0}
service.create('a', 1); // {code:422,path:'a',value:1}
// EnvironmentState = {a:0}
```

### update

```js
// EnvironmentState = {a:0}
service.update('a', 1); // {code:200,path:'a',value:1}
// EnvironmentState = {a:1}
service.update('2a', 0); // {code:400,path:'2a',value:0}
// EnvironmentState = {a:1}
service.update('b', 1); // {code:422,path:'b',value:1}
// EnvironmentState = {a:1}
```

### upsert

```js
// EnvironmentState = {a:0}
service.upsert('a', 1); // {code:200,path:'a',value:1}
// EnvironmentState = {a:1}
service.upsert('b', 1); // {code:201,path:'b',value:1}
// EnvironmentState = {a:1, b:1}
service.upsert('2a', 0); // {code:400,path:'2a',value:0}
// EnvironmentState = {a:1, b:1}
```

### delete

```js
// EnvironmentState = {a:0, b:1}
service.delete('a'); // {code:204,path:'a'}
// EnvironmentState = {b:1}
service.delete('2a'); // {code:400,path:'2a'}
// EnvironmentState = {b:1}
service.delete('a'); // {code:422,path:'a'}
// EnvironmentState = {b:1}
```

### add

```js
// EnvironmentState = {a:0}
service.add({ a: 1 }); // {code:200,value:{a:1}}
// EnvironmentState = {a:1}
service.add({ a: 1 }, 'a'); // {code:200,path:'a',value:{a:1}}
// EnvironmentState = {a:{a:1}}
service.add({ b: 1 }, 'a'); // {code:200,path:'a',value:{b:1}}
// EnvironmentState = {a:{b:1}}
service.add({ a: 1 }, '2a'); // {code:400,path:'2a',value:{a:1}}
// EnvironmentState = {a:{b:1}}
```

### merge

```js
// EnvironmentState = {a:0}
service.merge({ a: 1 }); // {code:200,value:{a:1}}
// EnvironmentState = {a:1}
service.merge({ a: 1 }, 'a'); // {code:200,path:'a',value:{a:1}}
// EnvironmentState = {a:{a:1}}
service.merge({ b: 1 }, 'a'); // {code:200,path:'a',value:{b:1}}
// EnvironmentState = {a:{a:1,b:1}}
service.merge({ a: 1 }, '2a'); // {code:400,path:'2a',value:{a:1}}
// EnvironmentState = {a:{a:1,b:1}}
```

### Log actions

You can override the methods you want to log.

```ts
class CustomEnvironmentService extends EnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }

  override reset(): EnvironmentResult {
    const result: EnvironmentResult = super.reset();
    this.displayLog('reset', result);
    return result;
  }

  override create(path: Path, value: Property): EnvironmentResult {
    const result: EnvironmentResult = super.create(path, value);
    this.displayLog('create', result, path, value);
    return result;
  }

  override update(path: Path, value: Property): EnvironmentResult {
    const result: EnvironmentResult = super.update(path, value);
    this.displayLog('update', result, path, value);
    return result;
  }

  override upsert(path: Path, value: Property): EnvironmentResult {
    const result: EnvironmentResult = super.upsert(path, value);
    this.displayLog('upsert', result, path, value);
    return result;
  }

  override delete(path: Path): EnvironmentResult {
    const result: EnvironmentResult = super.delete(path);
    this.displayLog('delete', result, path);
    return result;
  }

  override add(properties: EnvironmentState, path?: Path): EnvironmentResult {
    const result: EnvironmentResult = super.add(properties, path);
    this.displayLog('add', result, properties, path);
    return result;
  }

  override merge(properties: EnvironmentState, path?: Path): EnvironmentResult {
    const result: EnvironmentResult = super.merge(properties, path);
    this.displayLog('merge', result, properties, path);
    return result;
  }

  protected displayLog(method: string, result: EnvironmentResult, ...args: any[]): void {
    if (result.code < 400) {
      console.log('CustomEnvironmentService', method, result, args);
    } else {
      console.error('CustomEnvironmentService', method, result, args);
    }
  }
}
```
