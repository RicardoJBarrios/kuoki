import { BehaviorSubject } from 'rxjs';

import { createEnvironmentLoader, EnvironmentLoader } from '../loader';
import { createEnvironmentQuery, EnvironmentQuery } from '../query';
import { createEnvironmentService, EnvironmentService } from '../service';
import { EnvironmentState, EnvironmentStore } from '../store';

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
    fetchMock.reset();
  });

  it(`Fallback sources`, () => {
    expect(true).toBeTrue();
  });

  it(`Use values from other sources`, async () => {
    // fetchMock.get('env.json', { basePath: 'https://api.com' });
    // fetchMock.get('https://api.com/resource', { a: 0 });

    const source1 = {
      isOrdered: true,
      required: true,
      load: async () => fetch('env.json').then((response: any) => response.json())
    };
    const source2 = {
      isOrdered: true,
      required: true,
      load: async () => {
        const basePath = await query.getAsync('basePath');
        return fetch(`${basePath}/resource`).then((response: any) => response.json());
      }
    };
    loader = createEnvironmentLoader(service, [source1, source2]);
    loader.load();

    await expect(query.getAsync('a')).resolves.toEqual(0);
  });
});
