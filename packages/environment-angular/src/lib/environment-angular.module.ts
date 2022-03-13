import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import {
  EnvironmentLoader,
  EnvironmentQuery,
  environmentQueryConfigFactory,
  EnvironmentService,
  EnvironmentStore
} from '@kuoki/environment';

import { EnvironmentAngularChildConfig, EnvironmentAngularConfig, getProvider } from './helpers';
import { DefaultEnvironmentLoader } from './loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from './query';
import { DefaultEnvironmentService } from './service';
import { ENVIRONMENT_SOURCES } from './source';
import { DefaultEnvironmentStore } from './store';

function environmentAngularModuleLoad(loader: EnvironmentLoader): () => Promise<void> {
  return () => loader.load();
}

@NgModule({ imports: [CommonModule] })
export class EnvironmentAngularModule {
  static forRoot(config?: EnvironmentAngularConfig): ModuleWithProviders<EnvironmentAngularModule> {
    return {
      ngModule: EnvironmentAngularModule,
      providers: [
        getProvider(EnvironmentStore, config?.store, DefaultEnvironmentStore),
        getProvider(EnvironmentService, config?.service, DefaultEnvironmentService, [EnvironmentStore]),
        getProvider(ENVIRONMENT_QUERY_CONFIG, config?.queryConfig, environmentQueryConfigFactory()),
        getProvider(EnvironmentQuery, config?.query, DefaultEnvironmentQuery, [
          EnvironmentStore,
          ENVIRONMENT_QUERY_CONFIG
        ]),
        getProvider(ENVIRONMENT_SOURCES, config?.sources, []),
        getProvider(EnvironmentLoader, config?.loader, DefaultEnvironmentLoader, [
          EnvironmentService,
          ENVIRONMENT_SOURCES
        ]),
        {
          provide: APP_INITIALIZER,
          useFactory: environmentAngularModuleLoad,
          deps: [EnvironmentLoader],
          multi: true
        }
      ]
    };
  }

  static forChild(config?: EnvironmentAngularChildConfig): ModuleWithProviders<EnvironmentAngularModule> {
    return {
      ngModule: EnvironmentAngularModule,
      providers: [
        getProvider(ENVIRONMENT_SOURCES, config?.sources, []),
        getProvider(EnvironmentLoader, config?.loader, DefaultEnvironmentLoader, [
          EnvironmentService,
          ENVIRONMENT_SOURCES
        ])
      ]
    };
  }
}
