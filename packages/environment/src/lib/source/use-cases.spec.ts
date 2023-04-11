import fetch, { disableFetchMocks, enableFetchMocks } from 'jest-fetch-mock';
import { catchError, of, throwError } from 'rxjs';

import { createEnvironmentLoader, EnvironmentLoader } from '../loader';
import { createEnvironmentQuery, EnvironmentQuery } from '../query';
import { createEnvironmentService, EnvironmentService } from '../service';
import { createEnvironmentStore, EnvironmentStore } from '../store';

describe('EnvironmentSource Use Cases', () => {
  let store: EnvironmentStore;
  let service: EnvironmentService;
  let query: EnvironmentQuery;
  let loader: EnvironmentLoader;

  beforeEach(() => {
    store = createEnvironmentStore({});
    service = createEnvironmentService(store);
    query = createEnvironmentQuery(store);
  });

  describe('fallback sources', () => {
    beforeEach(() => {
      jest.spyOn(service, 'add');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it(`using Promise catch`, async () => {
      const state1 = { a: 0 };
      const source1 = { load: async () => Promise.reject().catch(() => Promise.resolve(state1)) };
      loader = createEnvironmentLoader(service, [source1]);

      await expect(loader.load()).toResolve();
      expect(service.add).toHaveBeenNthCalledWith(1, state1, undefined);
    });

    it(`using RxJS catchError`, async () => {
      const state = { a: 0 };
      const source = {
        load: () => throwError(() => new Error()).pipe(catchError(() => of(state)))
      };
      loader = createEnvironmentLoader(service, [source]);

      await expect(loader.load()).toResolve();
      expect(service.add).toHaveBeenNthCalledWith(1, state, undefined);
    });
  });

  it(`Use values from other sources`, async () => {
    fetch.mockOnce(JSON.stringify({ basePath: 'https://myapi.com/api' })).mockOnce(JSON.stringify({ a: 0 }));
    const source1 = {
      load: async () => fetch('env.json').then((response: Response) => response.json())
    };
    const source2 = {
      load: async () => {
        const basePath = await query.getAsync('basePath');
        return fetch(`${basePath}/resource`).then((response: Response) => response.json());
      }
    };
    loader = createEnvironmentLoader(service, [source1, source2]);

    loader.load();

    await expect(query.getAsync('a')).resolves.toEqual(0);
    expect(fetch.mock.calls[0][0]).toEqual('env.json');
    expect(fetch.mock.calls[1][0]).toEqual('https://myapi.com/api/resource');

    fetch.resetMocks();
  });
});
