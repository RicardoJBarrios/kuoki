import createMockInstance from 'jest-create-mock-instance';

import { InvalidPathError, Path, PathDoesntExistError, PathExistsError } from '../path';
import { DefaultEnvironmentStore, EnvironmentStore } from '../store';
import { DefaultEnvironmentService } from './environment-service.application';
import { EnvironmentService } from './environment-service.gateway';

describe('DefaultEnvironmentService', () => {
  let store: EnvironmentStore;
  let service: EnvironmentService;

  beforeEach(() => {
    store = createMockInstance(DefaultEnvironmentStore);
    service = new DefaultEnvironmentService(store);
  });

  beforeEach(() => {
    jest.spyOn(store, 'getAll').mockReturnValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('reset()', () => {
    it(`returns {code:205} if the store is reset`, () => {
      expect(service.reset()).toEqual({ code: 205 });
    });

    it(`resets the environment store to the initial state`, () => {
      expect(store.reset).not.toHaveBeenCalled();

      service.reset();
      expect(store.reset).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:460,error} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'reset').mockImplementation(() => {
        throw error;
      });

      expect(service.reset()).toEqual({ code: 460, error });
    });
  });

  describe('create(path,value)', () => {
    it(`returns {code:201,path,value} if property created`, () => {
      const path: Path = 'a';
      const value = 0;

      expect(service.create(path, value)).toEqual({ code: 201, path, value });
    });

    it(`updates the environment store if property created`, () => {
      service.create('a', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property created with complex path`, () => {
      service.create('a.a', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property created in complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.create('a.b', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0, b: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({}));

      service.create('a', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,path,value,error} if invalid path`, () => {
      const path = '2z';
      const value = 0;
      const error = new InvalidPathError(path);

      expect(service.create(path, value)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.create('2z', 0);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422,path,value,error} if property already exists`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });
      const path = 'a';
      const value = 1;
      const error = new PathExistsError(path);

      expect(service.create(path, value)).toEqual({ code: 422, path, value, error });
    });

    it(`returns {code:422,path,value,error} if path already exists`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });
      const path = 'a.a.b';
      const value = 1;
      const error = new PathExistsError(path);

      expect(service.create(path, value)).toEqual({ code: 422, path, value, error });
    });

    it(`ignores the operation if property already exists`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });

      service.create('a', 1);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`ignores the operation if path already exists`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.create('a.a.b', 1);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,path,value,error} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = 1;

      expect(service.create(path, value)).toEqual({ code: 460, path, value, error });
    });
  });

  describe('update(path,value)', () => {
    it(`returns {code:200,path,value} if property updated`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });
      const path = 'a';
      const value = 1;

      expect(service.update(path, value)).toEqual({ code: 200, path, value });
    });

    it(`updates the environment store if property updated`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });

      service.update('a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property updated with complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.update('a.a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 1 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property updated in complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.update('a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({ a: 0 }));

      service.update('a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,path,value,error} if invalid path`, () => {
      const path = '2z';
      const value = 0;
      const error = new InvalidPathError(path);

      expect(service.update(path, value)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.update('2z', 0);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422,path,value,error} if path doesn't exist`, () => {
      const path = 'a';
      const value = 1;
      const error = new PathDoesntExistError(path);

      expect(service.update(path, value)).toEqual({ code: 422, path, value, error });
    });

    it(`ignores the operation if path doesn't exist`, () => {
      service.update('a', 1);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,path,value,error} if store error`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = 1;

      expect(service.update(path, value)).toEqual({ code: 460, path, value, error });
    });
  });

  describe('upsert(path,value)', () => {
    it(`returns {code:201,path,value} if property created`, () => {
      const path = 'a';
      const value = 0;
      expect(service.upsert(path, value)).toEqual({ code: 201, path, value });
    });

    it(`updates the environment store if property created`, () => {
      service.upsert('a', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property created with complex path`, () => {
      service.upsert('a.a', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property created in complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.upsert('a.b', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0, b: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200,path,value} if property updated`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });
      const path = 'a';
      const value = 1;

      expect(service.upsert(path, value)).toEqual({ code: 200, path, value });
    });

    it(`updates the environment store if property updated`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });

      service.upsert('a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property updated with complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.upsert('a.a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 1 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property updated in complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.upsert('a', 1);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({}));

      service.upsert('a', 0);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,path,value,error} if invalid path`, () => {
      const path = '2z';
      const value = 0;
      const error = new InvalidPathError(path);

      expect(service.upsert(path, value)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.upsert('2z', 0);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,path,value,error} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = 1;

      expect(service.upsert(path, value)).toEqual({ code: 460, path, value, error });
    });
  });

  describe('delete(path)', () => {
    it(`returns {code:204,path} if property deleted`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });
      const path = 'a';

      expect(service.delete(path)).toEqual({ code: 204, path });
    });

    it(`updates the environment store if property deleted`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });

      service.delete('a');
      expect(store.update).toHaveBeenNthCalledWith(1, {});
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property deleted with complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.delete('a.a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: {} });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property deleted in complex path`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.delete('a');
      expect(store.update).toHaveBeenNthCalledWith(1, {});
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({ a: 0 }));

      service.delete('a');
      expect(store.update).toHaveBeenNthCalledWith(1, {});
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,path,error} if invalid path`, () => {
      const path = '2z';
      const error = new InvalidPathError(path);

      expect(service.delete(path)).toEqual({ code: 400, path, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.delete('2z');
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422,path,error} if path doesn't exist`, () => {
      const path = 'a';
      const error = new PathDoesntExistError(path);

      expect(service.delete(path)).toEqual({ code: 422, path, error });
    });

    it(`ignores the operation if path doesn't exist`, () => {
      service.delete('a');
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,path,error} if store error`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: 0 });
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';

      expect(service.delete(path)).toEqual({ code: 460, path, error });
    });
  });

  describe('add(properties,path?)', () => {
    it(`returns {code:200,value} if property added`, () => {
      const value = { a: 0 };

      expect(service.add(value)).toEqual({ code: 200, value });
    });

    it(`updates the environment store if property added`, () => {
      service.add({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200,value,path} if property added with path`, () => {
      const value = { a: 0 };
      const path = 'a';

      expect(service.add(value, path)).toEqual({ code: 200, value, path });
    });

    it(`updates the environment store if property added with path`, () => {
      service.add({ a: 0 }, 'a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property added with complex path`, () => {
      service.add({ a: 0 }, 'a.a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: { a: 0 } } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store overwriting existing values`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.add({ a: { b: 1 }, b: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { b: 1 }, b: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store overwriting existing arrays`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: [0] } });

      service.add({ a: { a: [1] } });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: [1] } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({}));

      service.add({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,value,path,error} if invalid path`, () => {
      const path = '2z';
      const value = { a: 0 };
      const error = new InvalidPathError(path);

      expect(service.add(value, path)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.add({ a: 0 }, '2z');
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,value,error,path?} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = { a: 0 };

      expect(service.add(value)).toEqual({ code: 460, value, error });
      expect(service.add(value, path)).toEqual({ code: 460, path, value, error });
    });
  });

  describe('addPreserving(properties,path?)', () => {
    it(`returns {code:200,value} if property added preserving`, () => {
      const value = { a: 0 };

      expect(service.addPreserving(value)).toEqual({ code: 200, value });
    });

    it(`updates the environment store if property added preserving`, () => {
      service.addPreserving({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200,value,path} if property added preserving with path`, () => {
      const value = { a: 0 };
      const path = 'a';

      expect(service.addPreserving(value, path)).toEqual({ code: 200, value, path });
    });

    it(`updates the environment store if property added preserving with path`, () => {
      service.addPreserving({ a: 0 }, 'a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property added preserving with complex path`, () => {
      service.addPreserving({ a: 0 }, 'a.a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: { a: 0 } } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store preserving existing values`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 } });

      service.addPreserving({ a: { b: 1 }, b: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 }, b: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store preserving existing arrays`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: [0] } });

      service.addPreserving({ a: { a: [1] } });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: [0] } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({}));

      service.addPreserving({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,value,path,error} if invalid path`, () => {
      const path = '2z';
      const value = { a: 0 };
      const error = new InvalidPathError(path);

      expect(service.addPreserving(value, path)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.addPreserving({ a: 0 }, '2z');
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,value,error,path?} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = { a: 0 };

      expect(service.addPreserving(value)).toEqual({ code: 460, value, error });
      expect(service.addPreserving(value, path)).toEqual({ code: 460, path, value, error });
    });
  });

  describe('merge(properties,path?)', () => {
    it(`returns {code:200,value} if property merged`, () => {
      const value = { a: 0 };

      expect(service.merge(value)).toEqual({ code: 200, value });
    });

    it(`updates the environment store if property merged`, () => {
      service.merge({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200,value,path} if property merged with path`, () => {
      const value = { a: 0 };
      const path = 'a';

      expect(service.merge(value, path)).toEqual({ code: 200, value, path });
    });

    it(`updates the environment store if property merged with path`, () => {
      service.merge({ a: 0 }, 'a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property merged with complex path`, () => {
      service.merge({ a: 0 }, 'a.a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: { a: 0 } } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store merging and overwriting existing values`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 }, b: 0 });

      service.merge({ a: { b: 1 }, b: 1 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0, b: 1 }, b: 1 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store merging existing arrays`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: [0] } });

      service.merge({ a: { a: [1] } });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: [0, 1] } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({}));

      service.merge({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,value,path,error} if invalid path`, () => {
      const path = '2z';
      const value = { a: 0 };
      const error = new InvalidPathError(path);

      expect(service.merge(value, path)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.merge({ a: 0 }, '2z');
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,value,error,path?} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = { a: 0 };

      expect(service.merge(value)).toEqual({ code: 460, value, error });
      expect(service.merge(value, path)).toEqual({ code: 460, path, value, error });
    });
  });

  describe('mergePreserving(properties,path?)', () => {
    it(`returns {code:200,value} if property merged preserving`, () => {
      const value = { a: 0 };

      expect(service.mergePreserving(value)).toEqual({ code: 200, value });
    });

    it(`updates the environment store if property merged preserving`, () => {
      service.mergePreserving({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200,value,path} if property merged preserving with path`, () => {
      const value = { a: 0 };
      const path = 'a';

      expect(service.mergePreserving(value, path)).toEqual({ code: 200, value, path });
    });

    it(`updates the environment store if property merged preserving with path`, () => {
      service.mergePreserving({ a: 0 }, 'a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0 } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if property merged preserving with complex path`, () => {
      service.mergePreserving({ a: 0 }, 'a.a');
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: { a: 0 } } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store merging and preserving existing values`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: 0 }, b: 0 });

      service.mergePreserving({ a: { b: 1 }, b: 1 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: 0, b: 1 }, b: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store merging existing arrays`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue({ a: { a: [0] } });

      service.mergePreserving({ a: { a: [1] } });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: { a: [0, 1] } });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(Object.freeze({}));

      service.mergePreserving({ a: 0 });
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0 });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400,value,path,error} if invalid path`, () => {
      const path = '2z';
      const value = { a: 0 };
      const error = new InvalidPathError(path);

      expect(service.mergePreserving(value, path)).toEqual({ code: 400, path, value, error });
    });

    it(`ignores the operation if invalid path`, () => {
      service.mergePreserving({ a: 0 }, '2z');
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:460,value,error,path?} if store error`, () => {
      const error = new Error('store error');
      jest.spyOn(store, 'update').mockImplementation(() => {
        throw error;
      });
      const path = 'a';
      const value = { a: 0 };

      expect(service.mergePreserving(value)).toEqual({ code: 460, value, error });
      expect(service.mergePreserving(value, path)).toEqual({ code: 460, path, value, error });
    });
  });
});
