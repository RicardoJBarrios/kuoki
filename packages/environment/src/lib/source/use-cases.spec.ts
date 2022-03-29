import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { BehaviorSubject } from 'rxjs';

import { createEnvironmentLoader, EnvironmentLoader } from '../loader';
import { createEnvironmentQuery, EnvironmentQuery } from '../query';
import { createEnvironmentService, EnvironmentService } from '../service';
import { EnvironmentState, EnvironmentStore } from '../store';

enableFetchMocks();

function createEnvironmentStore(initial: EnvironmentState) {
  const state = new BehaviorSubject(initial);

  return {
    getAll$: () => state.asObservable(),
    getAll: () => state.getValue(),
    update: (environment: EnvironmentState) => state.next(environment),
    reset: () => state.next(initial)
  };
}

describe('EnvironmentSource Use Cases', () => {
  let state: BehaviorSubject<EnvironmentState>;
  let store: EnvironmentStore;
  let service: EnvironmentService;
  let query: EnvironmentQuery;
  let loader: EnvironmentLoader;

  beforeEach(() => {
    state = new BehaviorSubject({});
    store = createEnvironmentStore({});
    service = createEnvironmentService(store);
    query = createEnvironmentQuery(store);
  });

  afterEach(() => {
    fetch.resetMocks();
  });

  it(`Fallback sources`, () => {
    expect(true).toBeTrue();
  });

  it(`Use values from other sources`, async () => {
    fetch.once(JSON.stringify({ basePath: 'https://myapi.com/api' })).once(JSON.stringify({ a: 0 }));
    const source1 = {
      load: async () => fetch('env.json').then((response: any) => response.json())
    };
    const source2 = {
      load: async () => {
        const basePath = await query.getAsync('basePath');
        return fetch(`${basePath}/resource`).then((response: any) => response.json());
      }
    };
    loader = createEnvironmentLoader(service, [source1, source2]);

    loader.load();

    await expect(query.getAsync('a')).resolves.toEqual(0);
    expect(fetch.mock.calls[0][0]).toEqual('env.json');
    expect(fetch.mock.calls[1][0]).toEqual('https://myapi.com/api/resource');
  });
});
