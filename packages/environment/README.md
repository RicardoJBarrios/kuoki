# Environment

> An Asynchronous Environment Manager for JavaScript and TypeScript Applications.

[![npm](https://img.shields.io/npm/v/@kuoki/environment?logo=npm&style=flat-square)](https://www.npmjs.com/package/@kuoki/environment) [![GitHub watchers](https://img.shields.io/github/watchers/ricardojbarrios/kuoki?logo=github&style=flat-square)](https://github.com/RicardoJBarrios/kuoki) [![Documentation](https://img.shields.io/badge/documentation-done-blue?style=flat-square)](https://ricardojbarrios.github.io/kuoki/environment/) [![Coverage](https://img.shields.io/sonar/coverage/kuoki-environment/master?server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://ricardojbarrios.github.io/kuoki/environment/coverage/) [![Quality Gate Status](https://img.shields.io/sonar/quality_gate/kuoki-environment?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://sonarcloud.io/project/overview?id=kuoki-environment) [![GitHub](https://img.shields.io/github/license/ricardojbarrios/kuoki?style=flat-square)](https://github.com/RicardoJBarrios/kuoki/blob/main/LICENSE.md) [![GitHub issues environment](https://img.shields.io/github/issues/ricardojbarrios/kuoki/environment?logo=github&label=issues&style=flat-square)](https://github.com/RicardoJBarrios/kuoki/labels/environment)

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
  </ol>
</details>

## About The Project

This library provides tools to manage environment properties in browser based JavaScript and TypeScript applications.

The common way to manage the application properties in browser based JavaScript frameworks is to define environment values in a constant or env file and load them at build stage. This strategy is not suitable for developments where, for example, the final build is deployed in a repositoy manager such as Nexus or Artifactory and reused in diferent environments, or in a microservices architecture where the properties are loaded from a config manager service. This library addresses this and other gaps by allowing, among others, the following behaviors:

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

Using NPM

```sh
npm install --save @kuoki/environment
```

Using Yarn

```sh
yarn add @kuoki/environment
```

Dependencies

- [rxjs](https://rxjs.dev) >= 7.0.0

## Usage

The steps to generate an environment manager are described below. Each of the steps is described in depth, with examples and common hacks, in the [documentation](https://ricardojbarrios.github.io/kuoki/environment/) of each module.

1. Implement and instantiate an [`EnvironmentStore`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentStore.html) to store the environment properties.
1. Implement and instantiate an [`EnvironmentService`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentService.html) to mutate the environment state.
1. Implement and instantiate an [`EnvironmentQuery`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentQuery.html) to get the environment properties.
1. Implement and instantiate as many [`EnvironmentSource`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentSource.html) as needed to get the environment properties.
1. Implement and instantiate an [`EnvironmentLoader`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentLoader.html) to get the properties from the sources.

There is a faster way to get started if you want to use all the default implementations, which is to use `createEnvironment()`, a factory that creates an [`EnvironmentModule`](https://ricardojbarrios.github.io/kuoki/environment/modules/EnvironmentModule.html) and starts the load of properties.

```ts
import { createEnvironmentModule, EnvironmentModule, EnvironmentQuery, EnvironmentSource } from '@kuoki/environment';

// env.json = { userName: 'JohnDoe01' }
const fileSource: EnvironmentSource = {
  isRequired: true,
  load: async () => fetch('env.json').then((response) => response.json())
};
const constSource: EnvironmentSource = {
  isRequired: true,
  load: () => [{ name: 'John Doe' }]
};
const environmentModule: EnvironmentModule = await createEnvironmentModule([fileSource, constSource]);
export const env: EnvironmentQuery = environmentModule.query;

env.getAll(); // {name:'John Doe',userName:'JohnDoe01'}
```

## Contributing

In order to better manage all the contributions it is important that, when creating a new issue or discussion, the label `environment` is added (as well any other required) and to follow the [Code of Conduct](https://github.com/RicardoJBarrios/kuoki/blob/dca1a8b10dec511585324873e52377a347454d54/CODE_OF_CONDUCT.md).

- :bug:` `If you want to track or report an issue in the code or documentation use the [Environment Issues](https://github.com/RicardoJBarrios/kuoki/labels/environment).
- :bulb:` `If you want to track or discuss new features or share new ideas use the [Environment Ideas](https://github.com/RicardoJBarrios/kuoki/discussions/categories/ideas?discussions_q=category%3AIdeas+label%3Aenvironment) discussion forum.
- :pray:` `If you want to track or get support use the [Environment Q&A](https://github.com/RicardoJBarrios/kuoki/discussions/categories/q-a?discussions_q=label%3Aenvironment+category%3AQ%26A) discussion forum.
- :raised_hands:` `If you want to track or show off what you have been able to do use the [Environment Show and tell](https://github.com/RicardoJBarrios/kuoki/discussions/categories/show-and-tell?discussions_q=label%3Aenvironment+category%3A%22Show+and+tell%22) discussion forum.
- :handshake:` ` If you want to contribute fixing issues or with new features you can create a [pull request](https://docs.github.com/es/github-ae@latest/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request) with the new code.
