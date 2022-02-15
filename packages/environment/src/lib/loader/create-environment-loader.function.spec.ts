import { createMockInstance } from 'jest-create-mock-instance';

import { EnvironmentService } from '../service';
import { EnvironmentSource } from '../source';
import { createEnvironmentLoader } from './create-environment-loader.function';
import { EnvironmentLoader } from './environment-loader.application';

const source1: EnvironmentSource = { id: '0', load: () => [{ a: 0 }] };
const source2: EnvironmentSource = { id: '1', load: () => [{ b: 0 }] };

describe('createEnvironmentLoader(service, sources?)', () => {
  let service: jest.Mocked<EnvironmentService>;

  beforeEach(() => {
    service = createMockInstance(EnvironmentService);
  });

  afterEach(() => {});

  it(`(service) returns an EnvironmentLoader without sources`, () => {
    const loader: any = createEnvironmentLoader(service);

    expect(loader).toBeInstanceOf(EnvironmentLoader);
    expect(loader.loaderSources).toEqual([]);
  });

  it(`(service, source) returns an EnvironmentLoader with a single source`, () => {
    const loader: any = createEnvironmentLoader(service, source1);

    expect(loader).toBeInstanceOf(EnvironmentLoader);
    expect(loader.loaderSources).toBeArrayOfSize(1);
    expect(loader.loaderSources[0].id).toEqual('0');
  });

  it(`(service, source[]) returns an EnvironmentLoader with an array of sources`, () => {
    const loader: any = createEnvironmentLoader(service, [source1, source2]);

    expect(loader).toBeInstanceOf(EnvironmentLoader);
    expect(loader.loaderSources).toBeArrayOfSize(2);
    expect(loader.loaderSources[0].id).toEqual('0');
    expect(loader.loaderSources[1].id).toEqual('1');
  });
});
