# Angular Environment Module

> Manages the injection of required services and values.

## EnvironmentModule

The enfironment module manages the injection of services required by the environment module.

To create an instance of all default services simply call the module `.forRoot()` static method.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EnvironmentModule } from '@kuoki/environment-angular';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, EnvironmentModule.forRoot()],
  bootstrap: [AppComponent]
})
class AppModule {}
```

But to be functional this static method will need at least the [`sources`](https://ricardojbarrios.github.io/kuoki/environment-angular/modules/EnvironmentSource.html) option. See the environment module config [documentation](https://ricardojbarrios.github.io/kuoki/environment-angular/interfaces/EnvironmentModule.EnvironmentModuleConfig.html) to know more about all the options.

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EnvironmentModule } from '@kuoki/environment-angular';

import { AppComponent } from './app.component';
import { environment } from './../environments/environment';

@Injectable({ providedIn: 'root' })
class AngularEnvironmentSource extends EnvironmentSource {
  override isRequired = true;

  load(): EnvironmentState[] {
    return [environment];
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, EnvironmentModule.forRoot({ sources: AngularEnvironmentSource })],
  bootstrap: [AppComponent]
})
class AppModule {}
```

## Use cases

Below are examples of the expected behavior and some implementation examples.

<details>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li><a href="#using-injection-tokens">Using Injection Tokens</a></li>
    <li><a href="#lazy-feature-module-with-the-same-loader-and-sources">Lazy Feature Module with the same loader and sources</a></li>
    <li><a href="#lazy-feature-module-with-custom-loader-and-sources">Lazy Feature Module with custom loader and sources</a></li>
  </ol>
</details>

### Using Injection Tokens

You can avoid the use of the `forRoot()` static method injecting all the required tokens. This option can help if any token must be calculated, for example by using a factory function. The provided instances will override the ones provided by `forRoot()`.

```ts
import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EnvironmentSource, EnvironmentState } from '@kuoku/environment';
import {
  DefaultEnvironmentLoader,
  DefaultEnvironmentQuery,
  DefaultEnvironmentService,
  DefaultEnvironmentStore,
  EnvironmentModule
} from '@kuoki/environment-angular';

import { AppComponent } from './app.component';
import { environment } from './../environments/environment';

@Injectable({ providedIn: 'root' })
class AngularEnvironmentSource extends EnvironmentSource {
  override isRequired = true;

  load(): EnvironmentState[] {
    return [environment];
  }
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, EnvironmentModule],
  providers: [
    { provide: ENVIRONMENT_INITIAL_STATE, useFactory: initialStateFromLocalStorage },
    { provide: EnvironmentStore, useClass: DefaultEnvironmentStore },
    { provide: EnvironmentService, useClass: DefaultEnvironmentService },
    { provide: ENVIRONMENT_QUERY_CONFIG, useValue: {} },
    { provide: EnvironmentQuery, useClass: DefaultEnvironmentQuery },
    { provide: ENVIRONMENT_SOURCES, useClass: AngularEnvironmentSource },
    { provide: EnvironmentLoader, useClass: DefaultEnvironmentLoader }
  ],
  bootstrap: [AppComponent]
})
class AppModule {}
```

### Lazy Feature Module with the same loader and sources

If the environment singleton services are required in a lazy loaded module simply import `EnvironmentModule`.

```ts
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EnvironmentModule } from '@kuoki/environment-angular';

@NgModule({
  imports: [CommonModule, EnvironmentModule]
})
class LazyFeatureModule {}
```

### Lazy Feature Module with custom loader and sources

If a feature module load in a lazy way needs to load s custom set of sources it can be done using the `forChild()` ststic method or injecting the sources and the loader tokens. See the sources [documentation](https://ricardojbarrios.github.io/kuoki/environment-angular/modules/EnvironmentSource.html#feature-module-sources) to know more details.

Once injected the module should execute the `load()` method of EnvironmentModule to load all the sources into the common environment state.

```ts
import { CommonModule } from '@angular/common';
import { Injectable, NgModule } from '@angular/core';
import { EnvironmentSource, EnvironmentState } from '@kuoku/environment';
import { EnvironmentModule } from '@kuoki/environment-angular';

@Injectable({ providedIn: 'root' })
class FeatureEnvironmentSource extends EnvironmentSource {
  override isRequired = true;
  override path: 'featureModule';

  load(): EnvironmentState[] {
    return [{ a: 0 }];
  }
}

@NgModule({
  imports: [CommonModule, EnvironmentModule.forChild({ sources: FeatureEnvironmentSource })]
})
class AppModule {
  constructor(protected readonly environmentLoader: EnvironmentLoader) {
    this.environmentLoader.load();
  }
}
```
