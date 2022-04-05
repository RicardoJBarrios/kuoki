# Environment Module

> An environment object with all the implemented services.

## createEnvironmentModule()

Creates an environment module with all the default implementations and starts the load of properties.

```ts
import { createEnvironmentModule, EnvironmentModule, EnvironmentSource } from '@kuoki/environment';

const source: EnvironmentSource = { load: () => [{ a: 0 }] };
const environmentModule: EnvironmentModule = await createEnvironmentModule(source);

environmentModule.query.get('a'); // 0
```

## Use cases

Below are examples of use cases.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#load-of-async-properties">Load of async properties</a></li>
  </ol>
</details>

### Load of async properties

If the source load asynchronous non required properties always use the async or reactive version of the methods to ensure that the call waits for the source to finish the load.

```ts
import { createEnvironmentModule, EnvironmentModule, EnvironmentSource } from '@kuoki/environment';

// env.json = {a:0}
const source: EnvironmentSource = {
  load: () => fetch('env.json').then((response: Response) => response.json())
};
const environmentModule: EnvironmentModule = await createEnvironmentModule(source);

environmentModule.query.get('a'); // undefined
await environmentModule.query.getAsync('a'); // 0
```
