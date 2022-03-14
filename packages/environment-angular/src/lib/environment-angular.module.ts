import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { EnvironmentLoader, EnvironmentQuery, EnvironmentService, EnvironmentStore } from '@kuoki/environment';

import { configProviderFactory, EnvironmentAngularChildConfig, EnvironmentAngularConfig } from './helpers';
import { DefaultEnvironmentLoader } from './loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from './query';
import { DefaultEnvironmentService } from './service';
import { ENVIRONMENT_SOURCES } from './source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_VALUE } from './store';

function environmentAngularModuleLoadBeforeInit(loader: EnvironmentLoader): () => Promise<void> {
  return () => loader.load();
}

function getLoadProvider(loadBeforeInit = true): Provider {
  return loadBeforeInit
    ? {
        provide: APP_INITIALIZER,
        useFactory: environmentAngularModuleLoadBeforeInit,
        deps: [EnvironmentLoader],
        multi: true
      }
    : [];
}

@NgModule({ imports: [CommonModule] })
export class EnvironmentAngularModule {
  static forRoot(config?: EnvironmentAngularConfig): ModuleWithProviders<EnvironmentAngularModule> {
    return {
      ngModule: EnvironmentAngularModule,
      providers: [
        configProviderFactory({
          provide: ENVIRONMENT_INITIAL_VALUE,
          configValue: config?.initialValue,
          defaultValue: {}
        }),
        configProviderFactory({
          provide: EnvironmentStore,
          configValue: config?.store,
          defaultValue: DefaultEnvironmentStore
        }),
        configProviderFactory({
          provide: EnvironmentService,
          configValue: config?.service,
          defaultValue: DefaultEnvironmentService,
          deps: [EnvironmentStore]
        }),
        configProviderFactory({
          provide: ENVIRONMENT_QUERY_CONFIG,
          configValue: config?.queryConfig,
          defaultValue: {}
        }),
        configProviderFactory({
          provide: EnvironmentQuery,
          configValue: config?.query,
          defaultValue: DefaultEnvironmentQuery,
          deps: [EnvironmentStore, ENVIRONMENT_QUERY_CONFIG]
        }),
        configProviderFactory({
          provide: ENVIRONMENT_SOURCES,
          configValue: config?.sources,
          defaultValue: []
        }),
        configProviderFactory({
          provide: EnvironmentLoader,
          configValue: config?.loader,
          defaultValue: DefaultEnvironmentLoader,
          deps: [EnvironmentService, ENVIRONMENT_SOURCES]
        }),
        getLoadProvider(config?.loadBeforeInit)
      ]
    };
  }

  static forChild(config?: EnvironmentAngularChildConfig): ModuleWithProviders<EnvironmentAngularModule> {
    return {
      ngModule: EnvironmentAngularModule,
      providers: [
        configProviderFactory({
          provide: ENVIRONMENT_SOURCES,
          configValue: config?.sources,
          defaultValue: []
        }),
        configProviderFactory({
          provide: EnvironmentLoader,
          configValue: config?.loader,
          defaultValue: DefaultEnvironmentLoader,
          deps: [EnvironmentService, ENVIRONMENT_SOURCES]
        })
      ]
    };
  }
}
