# Angular Environment Decorators

> Decorators to assign an environment value to a property of an object.

These decorators sets the property value, or getter/setter value, with the value at path from the Environment only if the original value is undefined. If the property value is defined at any moment the decorator's behavior will be ignored.

To use these decorators it is not necessary to inject the [`EnvironmentQuery`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html) service into the component. They use their own injector to get the properties.

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
  <li><a href="#environmentprefix">@EnvironmentPrefix</a></li>
    <li><a href="#environmentvalue">@EnvironmentValue</a></li>
    <li><a href="#environmentvalueasync">@EnvironmentValueAsync</a></li>
    <li><a href="#environmentvalue-1">@EnvironmentValue$</a></li>
    <li><a href="#static-option">Static option</a></li>
    <li><a href="#best-practices">Best practices</a></li>
  </ol>
</details>

### @EnvironmentPrefix

Sets a base path for the class used by the other decorators.

```ts
@Injectable()
@EnvironmentPrefix('a')
class ClassA {
  @EnvironmentValue('a');
  a?: number;
}

// Environment = {a:{a:0}}
classA.a; // 0
```

### @EnvironmentValue

Gets the synchronous value at path from environment if the property, or the getter, is undefined.

This decorator uses the [`EnvironmentQuery.get(Path,GetOptions?)`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html#get) to set the value if the decorated property value its undefined.

```ts
@Injectable()
class TestService {
  @EnvironmentValue('a')
  a?: number;

  @EnvironmentValue('a')
  b: number = 1;

  @EnvironmentValue('z')
  c?: number;

  @EnvironmentValue('z', { defaultValue: 1 })
  d!: number;

  @EnvironmentValue('a', { targetType: (v?: number) => (v ?? 0) + 1 })
  e!: number;

  @EnvironmentValue('b', { transpile: { a: 0 } })
  f?: string;

  @EnvironmentValue('b', { transpile: {}, config: { transpileEnvironment: true } })
  g?: string;

  @EnvironmentValue('a', { required: true })
  h!: number;

  @EnvironmentValue('z', { required: true })
  i!: number;

  private _getter?: number = undefined;

  @EnvironmentValue('a')
  get getter(): number | undefined {
    return this._getter;
  }

  set getter(value: number | undefined) {
    this._getter = value;
  }

  private _setter?: number = undefined;

  get setter(): number | undefined {
    return this._setter;
  }

  @EnvironmentValue('a')
  set setter(value: number | undefined) {
    this._setter = value;
  }

  @EnvironmentValue('a')
  method(): number | undefined {
    return undefined;
  }
}

const testService: TestService = inject(TestService);

// Environment = {a:0, b:'v{{a}}'};
testService.a; // 0
testService.b; // 1
testService.c; // undefined
testService.d; // 1
testService.e; // 2
testService.f; // 'v0'
testService.g; // 'v0'
testService.h; // 0
testService.i; // throws EnvironmentReferenceError
testService.getter; // 0
testService.setter; // 0
testService.method(); // undefined
```

### @EnvironmentValueAsync

Gets the value at path from environment if the property is undefined.

This decorator uses the [`EnvironmentQuery.get(Path,GetOptions?)`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html#get) to set the value if the decorated property value its undefined.

```ts
@Injectable()
class TestService {
  @EnvironmentValueAsync('a')
  a?: Promise<number>;

  @EnvironmentValueAsync('a')
  b: Promise<number> = Promise.resolve(1);

  @EnvironmentValueAsync('z')
  c?: Promise<number>;

  @EnvironmentValueAsync('z', { defaultValue: 1 })
  d!: Promise<number>;

  @EnvironmentValueAsync('a', { targetType: (v?: number) => (v ?? 0) + 1 })
  e!: Promise<number>;

  @EnvironmentValueAsync('b', { transpile: { a: 0 } })
  f?: Promise<string>;

  @EnvironmentValueAsync('b', { transpile: {}, config: { transpileEnvironment: true } })
  g?: Promise<string>;

  @EnvironmentValueAsync('z', { dueTime: 10 })
  h!: Promise<number>;

  private _getter?: Promise<number> = undefined;

  @EnvironmentValueAsync('a')
  get getter(): Promise<number | undefined> {
    return this._getter;
  }

  set getter(value: Promise<number | undefined>) {
    this._getter = value;
  }

  private _setter?: Promise<number> = undefined;

  get setter(): Promise<number | undefined> {
    return this._setter;
  }

  @EnvironmentValueAsync('a')
  set setter(value: Promise<number | undefined>) {
    this._setter = value;
  }

  @EnvironmentValueAsync('a')
  method(): Promise<number> | undefined {
    return undefined;
  }
}

const testService: TestService = inject(TestService);

// Environment = {a:0, b:'v{{a}}'};
testService.a; // Promise 0
testService.b; // Promise 1
testService.c; // Promise never resolves
testService.d; // Promise 1
testService.e; // Promise 2
testService.f; // Promise 'v0'
testService.g; // Promise 'v0'
testService.h; // Promise undefined after 10 ms
testService.getter; // Promise 0
testService.setter; // Promise 0
testService.method(); // undefined
```

### @EnvironmentValue$

### Static option

Value decorators have a `static` option which defaults to true. With the default config the instance property will store the first value returned by the environment query, and this value will not change unless the property is set to undefined again.

```ts
@Injectable()
class ClassA {
  @EnvironmentValue('a');
  a?: number;
}

const classA: ClassA = Injector.get(ClassA);


// Environment = ^-{a:0}-{a:1}-

// at 0ms
classA.a; // undefined

// at 20ms
classA.a; // 0

// at 40ms or more
classA.a; // 0
```

If the value is set to false, it becomes a not pure function, and will always return the current state of the environment value at the time of the query.

```ts
@Injectable()
class ClassA {
  @EnvironmentValue('a', {static: false});
  a?: number;
}

const classA: ClassA = Injector.get(ClassA);


// Environment = ^-{a:0}-{a:1}-

// at 0ms
classA.a; // undefined

// at 20ms
classA.a; // 0

// at 40ms or more
classA.a; // 1
```

### Best practices

1. Assign a type to the property decorated, because the getter and setters from the property descriptor cannot assert a type.
1. Make the decorated property readonly to avoid mutation related problems. If the value must change over the application lifecycle use the reactive version.
1. In strict mode the property must be marked as optional `?`. Use the bang operator `!` only if the environment property is mandatory or a default value is set.

```ts
@Injectable()
class ClassA {
  @EnvironmentValue<string>('api.path');
  readonly apiPath!: string;

  @EnvironmentValue<number>('user.yob');
  readonly yearOfBirth?: number;

  @EnvironmentValue$<boolean>('isOfferPeriod', { defaultValue: false });
  readonly isOfferPeriod$!: Observable<boolean>;
}
```
