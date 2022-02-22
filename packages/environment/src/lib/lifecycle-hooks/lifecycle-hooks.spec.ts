import { install, InstalledClock } from '@sinonjs/fake-timers';
import { createMockInstance } from 'jest-create-mock-instance';
import { ArrayOrSingle } from 'ts-essentials';

import {
  OnAfterComplete,
  OnAfterError,
  OnAfterLoad,
  OnAfterSourceAdd,
  OnAfterSourceComplete,
  OnAfterSourceError,
  OnBeforeLoad,
  OnBeforeSourceAdd,
  OnBeforeSourceLoad
} from '../lifecycle-hooks';
import { EnvironmentLoader, LoaderSource } from '../loader';
import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { EnvironmentState } from '../store';

const hook = jest.fn();

class Loader
  extends EnvironmentLoader
  implements
    OnAfterLoad,
    OnAfterComplete,
    OnAfterError,
    OnAfterSourceAdd,
    OnAfterSourceComplete,
    OnAfterSourceError,
    OnBeforeLoad,
    OnBeforeSourceAdd,
    OnBeforeSourceLoad
{
  constructor(
    protected override service: EnvironmentService,
    protected override sources?: ArrayOrSingle<EnvironmentSource>
  ) {
    super(service, sources);
  }
  onAfterLoad(): void {
    hook('onAfterLoad');
  }
  onAfterComplete(): void {
    hook('onAfterComplete');
  }
  onAfterError<E extends Error>(error: E): void {
    hook('onAfterError', error);
  }
  onAfterSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    hook('onAfterSourceAdd', properties, source);
  }
  onAfterSourceComplete(source: LoaderSource): void {
    hook('onAfterSourceComplete', source);
  }
  onAfterSourceError(error: Error, source: LoaderSource): void {
    hook('onAfterSourceError', error, source);
  }
  onBeforeLoad(): void {
    hook('onBeforeLoad');
  }
  onBeforeSourceAdd(properties: EnvironmentState, source: LoaderSource): void {
    hook('onBeforeSourceAdd', properties, source);
  }
  onBeforeSourceLoad(source: LoaderSource): void {
    hook('onBeforeSourceLoad', source);
  }
}

describe('LifecycleHooks integration with EnvironmentLoader', () => {
  let service: jest.Mocked<EnvironmentService>;
  let loader: EnvironmentLoader;
  let clock: InstalledClock;

  beforeEach(() => {
    service = createMockInstance(EnvironmentService);
    loader = new Loader(service);
    clock = install();
  });

  afterEach(() => {
    clock.uninstall();
    hook.mockRestore();
    jest.restoreAllMocks();
  });

  it(`executes hooks in order if resolves`, async () => {
    const properties: EnvironmentState = { a: 0 };
    const afterProperties: EnvironmentState = { b: 0 };
    const source1: EnvironmentSource = { load: () => [properties] };
    loader = new Loader(service, [source1]);
    loader.preAddProperties = () => afterProperties;
    const source: LoaderSource = loader['loaderSources'][0];

    await expect(loader.load()).toResolve();
    expect(hook).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
    expect(hook).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad', source);
    expect(hook).toHaveBeenNthCalledWith(3, 'onBeforeSourceAdd', properties, source);
    expect(hook).toHaveBeenNthCalledWith(4, 'onAfterSourceAdd', afterProperties, source);
    expect(hook).toHaveBeenNthCalledWith(5, 'onAfterSourceComplete', source);
    expect(hook).toHaveBeenNthCalledWith(6, 'onAfterComplete');
    expect(hook).toHaveBeenNthCalledWith(7, 'onAfterLoad');
  });

  it(`executes hooks in order if rejects`, async () => {
    const error: Error = new Error('test');
    const finalError: Error = new Error('The environment source "a" failed to load: test');
    const source1: EnvironmentSource = {
      id: 'a',
      isRequired: true,
      load: () => {
        throw error;
      }
    };
    loader = new Loader(service, [source1]);
    const source: LoaderSource = loader['loaderSources'][0];

    await expect(loader.load()).toReject();
    expect(hook).toHaveBeenNthCalledWith(1, 'onBeforeLoad');
    expect(hook).toHaveBeenNthCalledWith(2, 'onBeforeSourceLoad', source);
    expect(hook).toHaveBeenNthCalledWith(3, 'onAfterSourceError', error, source);
    expect(hook).toHaveBeenNthCalledWith(4, 'onAfterSourceComplete', source);
    expect(hook).toHaveBeenNthCalledWith(5, 'onAfterComplete');
    expect(hook).toHaveBeenNthCalledWith(6, 'onAfterError', finalError);
  });
});
