# Environment

> A Reactive Environment Management for JS Applications

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kuoki-environment&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kuoki-environment) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=kuoki-environment&metric=coverage)](https://sonarcloud.io/summary/new_code?id=kuoki-environment)

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

This library provides an environment properties store that is populated by asyncronous sources and exposes a query to get the values, as well a service to modify them at runtime.

The common way to manage the application properties in JavaScript frameworks is to define environment values in a constant or env file an load them at build stage. This strategy is not suitable for developments where, for example, the final build is deployed in a repositoy manager such as Nexus or Artifactory and reused in diferent environments, or in a microservices architecture where the properties are loaded from a config manager service. This library addresses this and other gaps by allowing, among others, the following behaviors:

- Get properties from constants
- Get properties from local sources, such as files
- Get properties from remote HTTP sources, such as a REST API
- Get properties from remote streaming sources, such as a WebSocket server
- Get properties from sources with interdependencies
- Get properties from multiple sources in order, unordered or by mixing strategies
- Stop source or application loading after a trigger
- Wait until required sources or properties are setted to load the application
- Define if the properties from a source should overwrite the existing ones or to merge with them
- Manage the loading lifecycle with hooks
- Implement a middleware to intercept the added properties

## Getting Started

### Installation

```sh
npm install --save @kuoki/environment
```

## Usage

The steps to generate an environment manager are described below. Each of the steps is described in depth, with examples and common hacks, in the [documentation](./) of each module.

1. Implement and instantiate an `EnvironmentStore` gateway object so that the library uses the same state manager as the rest of the application.
1. Create an instance of `EnvironmentService` to handle the modification of environment properties.
1. Create an instance of `EnvironmentQuery` to get environment properties.
1. Implement and instantiate as many `EnvironmentSource` gateway objects as needed to get the environment properties.
1. Create an instance of `EnvironmentLoader` to get the properties from the sources.

```js
import { createEnvironmentLoader, createEnvironmentQuery, createEnvironmentService } from '@kuoki/environment';
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

const service = createEnvironmentService(store);
const query = createEnvironmentQuery(store);
const loader = createEnvironmentLoader(service, [fileSource, constSource]);

loader.load().then(() => {
  console.log(query.getAll()); // LOG {name:'John Doe',userName:'JohnDoe01'}
});
```

## Roadmap

See the [open issues](https://github.com/RicardoJBarrios/kuoki/labels/environment) for a full list of proposed features (and known issues).

## License

Distributed under the MIT License. See [`LICENSE`](https://github.com/RicardoJBarrios/kuoki/blob/main/LICENSE.md) for more information.
