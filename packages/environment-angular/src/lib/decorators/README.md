# Angular Environment Decorators

> Decorators to assign an environment value to an object property.

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#value">@Value</a></li>
    <li><a href="#valueasync">@ValueAsync</a></li>
    <li><a href="#value-1">@Value$</a></li>
  </ol>
</details>

### @Value

This decorator uses the [`EnvironmentQuery.get(path,options?)`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html#get) to get the value if the decorated property value its undefined.

```ts
class ClassA {
  @Value('a');
  a?: number;

  @Value('a');
  a2?: number = 1;

  @Value('b');
  b?: number;

  @Value('b');
  b2?: number = 2;

  @Value('c', {defaultValue: 3, targetType: String});
  c?: string;

  @Value('c', {defaultValue: 3, targetType: String});
  c2?: string = '4';
}

const a = new ClassA();

// Environment = { a: 0 }
a.a; // 0
a.a = 10;
a.a; // 10
a.a = null;
a.a; // null
a.a = undefined;
a.a; // 0
a.a2; // 1
a.b; // undefined
a.b2; // 2
a.c; // '3'
a.c2; // '4'
```

Value decorators are not pure functions. Will always return the current state of the environment value at the time of the query.

```ts
// Environment = ^-{a:0}-{a:1}-
const a = new ClassA();

// at 0ms
a.a; // LOG undefined
// at 20ms
a.a; // LOG 0
// at 40ms or more
a.a; // LOG 1
```

### @ValueAsync

### @Value$
