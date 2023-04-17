# Environment Service

> Sets the EnvironmentState properties.

This service is responsible for mutating the EnvironmentState values. It is normally only needed for the load operation, and should not be exposed to the rest of the application unless for functional reasons the properties can be mutated at runtime. Each method returns an `EnvironmentResult` to make it easy to develop customizations.

EnvironmentService is an interface that must be implemented to mutate the environment store. Can be integrated into any application using the provided default implementation or a custom one.

```ts
import { EnvironmentService } from '@kuoki/environment';

class CustomEnvironmentService implements EnvironmentService {
  // ...implement environment service interface
}

const environmentService: EnvironmentService = new CustomEnvironmentService();
```

## DefaultEnvironmentService

A basic implementation that can be instantiated from...

1. A factory function.

```js
import {
  createEnvironmentService,
  createEnvironmentStore,
  EnvironmentService,
  EnvironmentStore
} from '@kuoki/environment';

const environmentStore: EnvironmentStore = createEnvironmentStore();
const environmentService: EnvironmentService = createEnvironmentService(environmentStore);
```

2. The newable class.

```js
import {
  DefaultEnvironmentService,
  DefaultEnvironmentStore,
  EnvironmentService,
  EnvironmentStore
} from '@kuoki/environment';

const environmentStore: EnvironmentStore = new DefaultEnvironmentStore();
const environmentService: EnvironmentService = new DefaultEnvironmentService(environmentStore);
```

3. A class that extends `DefaultEnvironmentService`.

```ts
import { DefaultEnvironmentService, EnvironmentStore } from '@kuoki/environment';

class CustomEnvironmentService extends DefaultEnvironmentService {
  constructor(protected override readonly store: EnvironmentStore) {
    super(store);
  }
  // ...override implementation
}

const environmentStore: EnvironmentStore = new DefaultEnvironmentStore();
const environmentService: EnvironmentService = new CustomEnvironmentService(environmentStore);
```

## Use cases

Below are examples of the expected behavior and some custom implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#reset">reset</a></li>
    <li><a href="#create">create</a></li>
    <li><a href="#update">update</a></li>
    <li><a href="#upsert">upsert</a></li>
    <li><a href="#delete">delete</a></li>
    <li><a href="#add">add</a></li>
    <li><a href="#addpreserving">addPreserving</a></li>
    <li><a href="#merge">merge</a></li>
    <li><a href="#mergepreserving">mergePreserving</a></li>
    <li><a href="#log-actions">Log actions</a></li>
  </ol>
</details>

### reset

Resets the initial EnvironmentState to the provided one.

```js
// EnvironmentState = {a:0}
environmentService.reset(); // {code:205}
// EnvironmentState = {}
```

### create

Creates a single new property in the EnvironmentState and returns an error if the path exists or the operation cannot complete.

```js
// EnvironmentState = {}
environmentService.create('a', 0);
// {code:201,path:'a',value:0}

// EnvironmentState = {a:0}
environmentService.create('2a', 0);
// {code:400,path:'2a',value:0}

// EnvironmentState = {a:0}
environmentService.create('a', 1);
// {code:422,path:'a',value:1}

// EnvironmentState = {a:0}
```

### update

Updates a single property from the EnvironmentState and returns an error if the path does not exist or the operation cannot be completed.

```js
// EnvironmentState = {a:0}
environmentService.update('a', 1);
// {code:200,path:'a',value:1}

// EnvironmentState = {a:1}
environmentService.update('2a', 0);
// {code:400,path:'2a',value:0}

// EnvironmentState = {a:1}
environmentService.update('b', 1);
// {code:422,path:'b',value:1}

// EnvironmentState = {a:1}
```

### upsert

Creates or updates a single property from the EnvironmentState and returns an error if the operation cannot be completed.

```js
// EnvironmentState = {a:0}
environmentService.upsert('a', 1);
// {code:200,path:'a',value:1}

// EnvironmentState = {a:1}
environmentService.upsert('b', 1);
// {code:201,path:'b',value:1}

// EnvironmentState = {a:1, b:1}
environmentService.upsert('2a', 0);
// {code:400,path:'2a',value:0}

// EnvironmentState = {a:1, b:1}
```

### delete

Deletes a single property from the EnvironmentState and returns an error if the path does not exist or the operation cannot be completed.

```js
// EnvironmentState = {a:0, b:1}
environmentService.delete('a');
// {code:204,path:'a'}

// EnvironmentState = {b:1}
environmentService.delete('2a');
// {code:400,path:'2a'}

// EnvironmentState = {b:1}
environmentService.delete('a');
// {code:422,path:'a'}

// EnvironmentState = {b:1}
```

### add

Adds a set of properties to the EnvironmentState overwriting the existing ones.

```js
// EnvironmentState = {a:{a:0}}
environmentService.add({ a: 1 });
// {code:200,value:{a:1}}

// EnvironmentState = {a:1}
environmentService.add({ a: 1 }, 'a');
// {code:200,path:'a',value:{a:1}}

// EnvironmentState = {a:{a:1}}
environmentService.add({ a: 0 }, 'a');
// {code:200,path:'a',value:{a:0}}

// EnvironmentState = {a:{a:0}}
environmentService.add({ a: 1 }, '2a');
// {code:400,path:'2a',value:{a:1}}

// EnvironmentState = {a:{a:0}}
```

### addPreserving

Adds a set of properties to the EnvironmentState preserving the existing ones.

```js
// EnvironmentState = {a:{a:0}
environmentService.addPreserving({ a: 1 });
// {code:200,value:{a:1}}

// EnvironmentState = {a:{a:0}}
environmentService.addPreserving({ a: 1 }, 'a');
// {code:200,path:'a',value:{a:1}}

// EnvironmentState = {a:{a:0}}
environmentService.addPreserving({ a: 0 }, 'a');
// {code:200,path:'b',value:{a:0}}

// EnvironmentState = {a:{a:0},b:{a:0}}
environmentService.addPreserving({ a: 1 }, '2a');
// {code:400,path:'2a',value:{a:1}}

// EnvironmentState = {a:{a:0},b:{a:0}}
```

### merge

Adds a set of properties to the EnvironmentState merging the values and overwriting the existing ones.

```js
// EnvironmentState = {a:0}
environmentService.merge({ a: 1 });
// {code:200,value:{a:1}}

// EnvironmentState = {a:1}
environmentService.merge({ a: 1 }, 'a');
// {code:200,path:'a',value:{a:1}}

// EnvironmentState = {a:{a:1}}
environmentService.merge({ b: 1 }, 'a');
// {code:200,path:'a',value:{b:1}}

// EnvironmentState = {a:{a:1,b:1}}
environmentService.merge({ b: 0 }, 'a');
// {code:200,path:'a',value:{b:0}}

// EnvironmentState = {a:{a:1,b:0}}
environmentService.merge({ a: 1 }, '2a');
// {code:400,path:'2a',value:{a:1}}

// EnvironmentState = {a:{a:1,b:0}}
```

### mergePreserving

Adds a set of properties to the EnvironmentState merging the values and preserving the existing ones.

```js
// EnvironmentState = {a:0}
environmentService.mergePreserving({ a: 1 });
// {code:200,value:{a:1}}

// EnvironmentState = {a:1}
environmentService.mergePreserving({ a: 1 }, 'a');
// {code:200,path:'a',value:{a:1}}

// EnvironmentState = {a:{a:1}}
environmentService.mergePreserving({ b: 1 }, 'a');
// {code:200,path:'a',value:{b:1}}

// EnvironmentState = {a:{a:1,b:1}}
environmentService.mergePreserving({ b: 0 }, 'a');
// {code:200,path:'a',value:{b:0}}

// EnvironmentState = {a:{a:1,b:1}}
environmentService.mergePreserving({ a: 1 }, '2a');
// {code:400,path:'2a',value:{a:1}}

// EnvironmentState = {a:{a:1,b:1}}
```

### Log actions

An example implementation that overrides all methods to provide a log of the actions.

```ts
import {
  DefaultEnvironmentService,
  EnvironmentResult,
  EnvironmentState,
  EnvironmentStore,
  Path,
  Property
} from '@kuoki/environment';

class CustomEnvironmentService extends DefaultEnvironmentService {
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
    this.displayLog('create', result);
    return result;
  }

  override update(path: Path, value: Property): EnvironmentResult {
    const result: EnvironmentResult = super.update(path, value);
    this.displayLog('update', result);
    return result;
  }

  override upsert(path: Path, value: Property): EnvironmentResult {
    const result: EnvironmentResult = super.upsert(path, value);
    this.displayLog('upsert', result);
    return result;
  }

  override delete(path: Path): EnvironmentResult {
    const result: EnvironmentResult = super.delete(path);
    this.displayLog('delete', result);
    return result;
  }

  override add(properties: EnvironmentState, path?: Path): EnvironmentResult {
    const result: EnvironmentResult = super.add(properties, path);
    this.displayLog('add', result);
    return result;
  }

  override addPreserving(properties: EnvironmentState, path?: Path): EnvironmentResult {
    const result: EnvironmentResult = super.addPreserving(properties, path);
    this.displayLog('addPreserving', result);
    return result;
  }

  override merge(properties: EnvironmentState, path?: Path): EnvironmentResult {
    const result: EnvironmentResult = super.merge(properties, path);
    this.displayLog('merge', result);
    return result;
  }

  override mergePreserving(properties: EnvironmentState, path?: Path): EnvironmentResult {
    const result: EnvironmentResult = super.mergePreserving(properties, path);
    this.displayLog('mergePreserving', result);
    return result;
  }

  protected displayLog(method: string, result: EnvironmentResult): void {
    console.log('CustomEnvironmentService', method, result);
  }
}
```
