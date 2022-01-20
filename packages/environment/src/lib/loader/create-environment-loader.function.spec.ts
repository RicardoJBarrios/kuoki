import { EnvironmentService } from '../service';
import { EnvironmentStore } from '../store';
import { TestEnvironmentStore } from '../store/environment-store.gateway.spec';
import { createEnvironmentLoader } from './create-environment-loader.function';
import { EnvironmentLoader } from './environment-loader.application';

const source1 = { name: '0', load: () => [{ a: 0 }] };
const source2 = { name: '1', load: () => [{ b: 0 }] };

describe('createEnvironmentLoader(service, sources?)', () => {
  let store: EnvironmentStore;
  let service: EnvironmentService;

  beforeEach(() => {
    store = new TestEnvironmentStore();
    service = new EnvironmentService(store);
  });

  it(`(service) returns an EnvironmentLoader without sources`, () => {
    const query: any = createEnvironmentLoader(service);
    expect(query).toBeInstanceOf(EnvironmentLoader);
    expect(query.loaderSources).toEqual([]);
  });

  it(`(service, source) returns an EnvironmentLoader with a single source`, () => {
    const query: any = createEnvironmentLoader(service, source1);
    expect(query).toBeInstanceOf(EnvironmentLoader);
    expect(query.loaderSources).toBeArrayOfSize(1);
    expect(query.loaderSources[0].name).toEqual('0');
  });

  it(`(service, source[]) returns an EnvironmentLoader with an array of sources`, () => {
    const query: any = createEnvironmentLoader(service, [source1, source2]);
    expect(query).toBeInstanceOf(EnvironmentLoader);
    expect(query.loaderSources).toBeArrayOfSize(2);
    expect(query.loaderSources[0].name).toEqual('0');
    expect(query.loaderSources[1].name).toEqual('1');
  });
});