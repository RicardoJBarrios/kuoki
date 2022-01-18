# Environment

> A Reactive Environment Management for JS Applications.

This library provides an environment properties store that is populated by asyncronous sources and exposes a query to get the values, as well a service to modify them at runtime.

The common way to manage the application properties in JavaScript frameworks is to define environment values in a constant or env file an load them at build stage. This strategy is not suitable for developments where, for example, the final build is deployed in a repositoy manager such as Nexus or Artifactory and reused in diferent environments, or in a microservices architecture where the properties are loaded from a config manager service. This library addresses this and other gaps by allowing, among others, the following behaviors:

- Get properties from constants
- Get properties from local sources, such as files
- Get properties from remote HTTP sources, such as a REST API
- Get properties from remote streaming sources, such as a WebSocket server
- Get properties from multiple sources in order, unordered or by mixing strategies
- Define if the properties from a source should overwrite the existing ones or to merge with them
- Get properties from sources with interdependencies
- Stop source or application loading after a trigger
- Manage the loading lifecycle with hooks
- Implement a middleware to intercept the added properties
- Wait until required sources or properties are setted to load the application

## Getting Started

### Installation

```sh
npm install --save @kuoki/environment
```

### Usage

To make this library work, there are two gateways to implement: `EnvironmentStore` and some `EnvironmentSource`. Each gateway documentation will further describe the API and examples for the most common use cases. In addition, the `EnvironmentService`, `EnvironmentQuery` and `EnvironmentLoader` applications are provided, which can be used with the current implementation or easily overridden to fine-tune their behavior.

A simple implementation and use in vanilla JavaScript could be something like the following code:

```js
import { EnvironmentLoader, EnvironmentQuery, EnvironmentService } from '@kuoki/environment';
import { BehaviorSubject } from 'rxjs';

const initialState = {};
const state = new BehaviorSubject(initialState);
const store = {
  getAll$: () => state.asObservable(),
  getAll: () => state.getValue(),
  update: (environment) => state.next(environment),
  reset: () => state.next(initialState),
};

// env.json = { userName: 'JohnDoe01' }
const fileSource = {
  requiredToLoad: true,
  load: async () => fetch('env.json'),
};
const constSource = {
  requiredToLoad: true,
  load: () => [{ name: 'John Doe' }],
};

const service = new EnvironmentService(store);
const query = new EnvironmentQuery(store);
const loader = new EnvironmentLoader(service, [fileSource, constSource]);

loader.load().then(() => {
  console.log(query.getAll()); // LOG {name:'John Doe',userName:'JohnDoe01'}
});
```
