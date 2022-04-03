import { delay, of, throwError } from 'rxjs';

import { DefaultEnvironmentLoader } from '../loader';
import { DefaultEnvironmentQuery } from '../query';
import { DefaultEnvironmentService } from '../service';
import { DefaultEnvironmentStore } from '../store';
import { createEnvironmentModule } from './create-environment-module.function';

describe('createEnvironmentModule(sources?)', () => {
  it(`returns {store} as DefaultEnvironmentStore`, async () => {
    const module = await createEnvironmentModule();
    expect(module.store).toBeInstanceOf(DefaultEnvironmentStore);
  });

  it(`returns {service} as DefaultEnvironmentService`, async () => {
    const module = await createEnvironmentModule();
    expect(module.service).toBeInstanceOf(DefaultEnvironmentService);
  });

  it(`returns {query} as DefaultEnvironmentQuery`, async () => {
    const module = await createEnvironmentModule();
    expect(module.query).toBeInstanceOf(DefaultEnvironmentQuery);
  });

  it(`returns {loader} as DefaultEnvironmentLoader`, async () => {
    const module = await createEnvironmentModule();
    expect(module.loader).toBeInstanceOf(DefaultEnvironmentLoader);
  });

  it(`loads the properties`, async () => {
    const source = { isRequired: true, load: () => of({ a: 0 }).pipe(delay(5)) };
    const query = (await createEnvironmentModule(source)).query;
    expect(query.get('a')).toEqual(0);
  });

  it(`rejects if load rejects`, async () => {
    const source = { id: 'a', isRequired: true, load: () => throwError(() => new Error()) };
    await expect(createEnvironmentModule(source)).rejects.toThrowError('The environment source "a" failed to load');
  });
});
