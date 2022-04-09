# Angular Environment Decorators

> Decorators to assign an environment value to an object property.

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#environmentvalue">@EnvironmentValue</a></li>
    <li><a href="#environmentvalueasync">@EnvironmentValueAsync</a></li>
    <li><a href="#environmentvalue-1">@EnvironmentValue$</a></li>
    <li><a href="#static-option">Static option</a></li>
    <li><a href="#best-practices">Best practices</a></li>
  </ol>
</details>

### @EnvironmentValue

This decorator uses the [`EnvironmentQuery.get(path,options?)`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html#get) to get the value if the decorated property value its undefined.

```ts
@Injectable()
class ClassA {
  @EnvironmentValue('a');
  a?: number;

  @EnvironmentValue('a');
  a2?: number = 1;

  @EnvironmentValue('b');
  b?: number;

  @EnvironmentValue('b');
  b2?: number = 2;

  @EnvironmentValue('c', {defaultValue: 3, targetType: String});
  c?: string;

  @EnvironmentValue('c', {defaultValue: 3, targetType: String});
  c2?: string = '4';
}

const classA: ClassA = Injector.get(ClassA);

// Environment = { a: 0 }
classA.a; // 0
classA.a = 10;
classA.a; // 10
classA.a = null;
classA.a; // null
classA.a = undefined;
classA.a; // 0
classA.a2; // 1
classA.b; // undefined
classA.b2; // 2
classA.c; // '3'
classA.c2; // '4'
```

### @EnvironmentValueAsync

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
