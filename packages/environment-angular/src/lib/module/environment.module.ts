import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, Inject, Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { EnvironmentLoader, EnvironmentQuery, EnvironmentService, EnvironmentStore } from '@kuoki/environment';

import { configProviderFactory, EnvironmentAngularChildConfig, EnvironmentModuleConfig } from '../helpers';
import { DefaultEnvironmentLoader } from '../loader';
import { DefaultEnvironmentQuery, ENVIRONMENT_QUERY_CONFIG } from '../query';
import { DefaultEnvironmentService } from '../service';
import { ENVIRONMENT_SOURCES } from '../source';
import { DefaultEnvironmentStore, ENVIRONMENT_INITIAL_VALUE } from '../store';

function loadBeforeInitFactory(loader: EnvironmentLoader): () => Promise<void> {
  return () => loader.load();
}

const requiredQueryError: Error = new Error(
  'An instance of EnvironmentQuery is required. ' +
    'Use EnvironmentModule.forRoot() or provide the EnvironmentQuery service'
);

@NgModule({ imports: [CommonModule] })
export class EnvironmentModule {
  private static _query?: EnvironmentQuery;

  /**
   * The singleton instance of EnvironmentQuery.
   * @throws If EnvironmentQuery is not provided.
   */
  static get query(): EnvironmentQuery | undefined {
    return EnvironmentModule._query;
  }

  /**
   * Initializes the EnvironmentModule with all the required services.
   * @param config Customizes the environment behavior and services.
   * @returns The EnvironmentModule with all the required services.
   */
  static forRoot(config?: EnvironmentModuleConfig): ModuleWithProviders<EnvironmentModule> {
    return {
      ngModule: EnvironmentModule,
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
        config?.loadBeforeInit ?? true
          ? {
              provide: APP_INITIALIZER,
              useFactory: loadBeforeInitFactory,
              deps: [EnvironmentLoader],
              multi: true
            }
          : []
      ]
    };
  }

  static forChild(config?: EnvironmentAngularChildConfig): ModuleWithProviders<EnvironmentModule> {
    return {
      ngModule: EnvironmentModule,
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

  constructor(@Inject(Injector) protected readonly injector: Injector) {
    const query: EnvironmentQuery | null = this.injector.get(EnvironmentQuery, null);

    if (query == null) {
      throw requiredQueryError;
    }

    EnvironmentModule._query = query;
  }
}