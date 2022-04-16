# Environment Angular

> An Asynchronous Environment Manager for Angular Applications.

[![npm](https://img.shields.io/npm/v/@kuoki/environment-angular?logo=npm&style=flat-square)](https://www.npmjs.com/package/@kuoki/environment-angular) [![GitHub watchers](https://img.shields.io/github/watchers/ricardojbarrios/kuoki?logo=github&style=flat-square)](https://github.com/RicardoJBarrios/kuoki) [![Documentation](https://img.shields.io/badge/documentation-done-blue?style=flat-square)](https://ricardojbarrios.github.io/kuoki/environment-angular/) [![Coverage](https://img.shields.io/sonar/coverage/kuoki-environment-angular/master?server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://ricardojbarrios.github.io/kuoki/environment-angular/coverage/) [![Quality Gate Status](https://img.shields.io/sonar/quality_gate/kuoki-environment-angular?logo=sonarcloud&server=https%3A%2F%2Fsonarcloud.io&style=flat-square)](https://sonarcloud.io/project/overview?id=kuoki-environment-angular) [![GitHub](https://img.shields.io/github/license/ricardojbarrios/kuoki?style=flat-square)](https://github.com/RicardoJBarrios/kuoki/blob/main/LICENSE.md) [![GitHub issues environment](https://img.shields.io/github/issues/ricardojbarrios/kuoki/environment-angular?logo=github&label=issues&style=flat-square)](https://github.com/RicardoJBarrios/kuoki/labels/environment-angular)

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>

## About The Project

This library provides wrappers for managing environment properties in Angular applications using the [`@kuoki/environment`](https://ricardojbarrios.github.io/kuoki/environment/) library, as well as additional tools such as decorators and guards.

## Getting Started

### Installation

Using NPM

```sh
npm install --save @kuoki/environment-angular
```

Using Yarn

```sh
yarn add @kuoki/environment-angular
```

Dependencies

- [Angular](https://angular.io) >= 13
- [rxjs](https://rxjs.dev) >= 7.0.0
- [@kuoki/environment](https://ricardojbarrios.github.io/kuoki/environment) >= 1.1.0

## Usage

```ts
import { HttpClientModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EnvironmentQuery, EnvironmentSource, EnvironmentState, filterNil } from '@kuoki/environment';
import { EnvironmentModule } from '@kuoki/environment-angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  template: `<h1>{{ pageTitle$ | async }}</h1>`
})
export class AppComponent {
  @EnvironmentValue$('pageTitle', { defaultValue: 'My App' })
  readonly pageTitle$!: Observable<string>;
}

@Injectable({ providedIn: 'root' })
class AngularEnvironmentSource implements EnvironmentSource {
  isRequired = true;

  load(): EnvironmentState[] {
    return [{ production: true }];
  }
}

@Injectable({ providedIn: 'root' })
class LocalFileSource implements EnvironmentSource {
  isRequired = true;

  constructor(protected readonly http: HttpClient) {}

  load(): Observable<EnvironmentState> {
    return this.http.get<EnvironmentState>(`assets/env.json`);
  }
}

@Injectable({ providedIn: 'root' })
class PropertiesServerSource implements EnvironmentSource {
  isRequired = true;

  constructor(protected readonly http: HttpClient, protected readonly query: EnvironmentQuery) {}

  load(): Observable<EnvironmentState> {
    return this.query.get$<string>('basePath').pipe(
      filterNil(),
      switchMap((basePath: string) => this.http.get<EnvironmentState>(`${basePath}/properties/myapp`))
    );
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    EnvironmentModule.forRoot({
      sources: [AngularEnvironmentSource, LocalFileSource, PropertiesServerSource]
    })
  ],
  bootstrap: [AppComponent]
})
class AppModule {}
```

See in [Stackblitz](https://basic-kuoki-environment-angular.stackblitz.io).
