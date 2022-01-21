import { EnvironmentState, EnvironmentStore } from '../store';
import { TestEnvironmentStore } from '../store/environment-store.gateway.spec';
import { EnvironmentService } from './environment-service.application';

describe('EnvironmentService', () => {
  let state: EnvironmentState;
  let readonlyState: Readonly<EnvironmentState>;
  let store: EnvironmentStore;
  let service: EnvironmentService;

  beforeEach(() => {
    state = { a: 0, x: { y: 0 }, z: [0] };
    readonlyState = Object.freeze({ a: 1, x: Object.freeze({ y: 0 }), z: [0] });
    store = new TestEnvironmentStore();
    service = new EnvironmentService(store);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('reset()', () => {
    beforeEach(() => {
      jest.spyOn(store, 'reset').mockImplementation(() => null);
    });

    it(`returns {code:205}`, () => {
      expect(service.reset()).toEqual({ code: 205 });
    });

    it(`resets the environment store to the initial state`, () => {
      expect(store.reset).not.toHaveBeenCalled();
      service.reset();
      expect(store.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('create(path, value)', () => {
    beforeEach(() => {
      jest.spyOn(store, 'getAll').mockReturnValue(state);
      jest.spyOn(store, 'update').mockImplementation(() => null);
    });

    it(`returns {code:201, path, value} if property created`, () => {
      const path = 'b.b';
      const value = 0;
      expect(service.create(path, value)).toEqual({ code: 201, path, value });
    });

    it(`updates the environment store if property created`, () => {
      const path = 'b.b';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.create(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 0 }, b: { b: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:201, path, value} if path doesn't exist`, () => {
      const path = 'x.z';
      const value = 0;
      expect(service.create(path, value)).toEqual({ code: 201, path, value });
    });

    it(`updates the environment store if path doesn't exist`, () => {
      const path = 'x.z';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.create(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 0, z: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'x.z';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.create(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, x: { y: 0, z: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400, path, value} if invalid path`, () => {
      const path = '2z';
      const value = 0;
      expect(service.create(path, value)).toEqual({ code: 400, path, value });
    });

    it(`ignores the action if invalid path`, () => {
      const path = '2z';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.create(path, value);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422, path, value} if property already exists`, () => {
      const path = 'x';
      const value = 1;
      expect(service.create(path, value)).toEqual({ code: 422, path, value });
    });

    it(`ignores the action if property already exists`, () => {
      const path = 'x';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.create(path, value);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422, path, value} if path already exists`, () => {
      const path = 'x.y.z.a';
      const value = 1;
      expect(service.create(path, value)).toEqual({ code: 422, path, value });
    });

    it(`ignores the action if path already exists`, () => {
      const path = 'x.y.z.a';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.create(path, value);
      expect(store.update).not.toHaveBeenCalled();
    });
  });

  describe('update(path, value)', () => {
    beforeEach(() => {
      jest.spyOn(store, 'getAll').mockReturnValue(state);
      jest.spyOn(store, 'update').mockImplementation(() => null);
    });

    it(`returns {code:200, path, value} if property updated`, () => {
      const path = 'x.y';
      const value = 1;
      expect(service.update(path, value)).toEqual({ code: 200, path, value });
    });

    it(`updates the environment store if property updated`, () => {
      const path = 'x.y';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.update(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 1 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'x.y';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.update(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, x: { y: 1 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400, path, value} if invalid path`, () => {
      const path = '2z';
      const value = 0;
      expect(service.update(path, value)).toEqual({ code: 400, path, value });
    });

    it(`ignores the action if invalid path`, () => {
      const path = '2z';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.update(path, value);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422, path, value} if property doesn't exist`, () => {
      const path = 'b';
      const value = 1;
      expect(service.update(path, value)).toEqual({ code: 422, path, value });
    });

    it(`ignores the action if property doesn't exist`, () => {
      const path = 'b';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.update(path, value);
      expect(store.update).not.toHaveBeenCalled();
    });
  });

  describe('upsert(path, value)', () => {
    beforeEach(() => {
      jest.spyOn(store, 'getAll').mockReturnValue(state);
      jest.spyOn(store, 'update').mockImplementation(() => null);
    });

    it(`returns {code:200, path, value} if property updated`, () => {
      const path = 'x.y';
      const value = 1;
      expect(service.upsert(path, value)).toEqual({ code: 200, path, value });
    });

    it(`updates the environment store if property updated`, () => {
      const path = 'x.y';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.upsert(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 1 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:201, path, value} if property created`, () => {
      const path = 'b.b';
      const value = 0;
      expect(service.upsert(path, value)).toEqual({ code: 201, path, value });
    });

    it(`updates the environment store if property created`, () => {
      const path = 'b.b';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.upsert(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 0 }, b: { b: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'x.y';
      const value = 1;
      expect(store.update).not.toHaveBeenCalled();
      service.upsert(path, value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, x: { y: 1 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400, path, value} if invalid path`, () => {
      const path = '2z';
      const value = 0;
      expect(service.upsert(path, value)).toEqual({ code: 400, path, value });
    });

    it(`ignores the action if invalid path`, () => {
      const path = '2z';
      const value = 0;
      expect(store.update).not.toHaveBeenCalled();
      service.upsert(path, value);
      expect(store.update).not.toHaveBeenCalled();
    });
  });

  describe('delete(path)', () => {
    beforeEach(() => {
      jest.spyOn(store, 'getAll').mockReturnValue(state);
      jest.spyOn(store, 'update').mockImplementation(() => null);
    });

    it(`returns {code:204, path} if property deleted`, () => {
      const path = 'x.y';
      expect(service.delete(path)).toEqual({ code: 204, path });
    });

    it(`updates the environment store if property deleted`, () => {
      const path = 'x.y';
      expect(store.update).not.toHaveBeenCalled();
      service.delete(path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: {}, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'x.y';
      expect(store.update).not.toHaveBeenCalled();
      service.delete(path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, x: {}, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400, path} if invalid path`, () => {
      const path = '2z';
      expect(service.delete(path)).toEqual({ code: 400, path });
    });

    it(`ignores the action if invalid path`, () => {
      const path = '2z';
      expect(store.update).not.toHaveBeenCalled();
      service.delete(path);
      expect(store.update).not.toHaveBeenCalled();
    });

    it(`returns {code:422, path} if property doesn't exist`, () => {
      const path = 'b';
      expect(service.delete(path)).toEqual({ code: 422, path });
    });

    it(`ignores the action if property doesn't exist`, () => {
      const path = 'b';
      expect(store.update).not.toHaveBeenCalled();
      service.delete(path);
      expect(store.update).not.toHaveBeenCalled();
    });
  });

  describe('add(properties, path?)', () => {
    beforeEach(() => {
      jest.spyOn(store, 'getAll').mockReturnValue(state);
      jest.spyOn(store, 'update').mockImplementation(() => null);
    });

    it(`returns {code:200, value} if property added`, () => {
      const value = { b: 0 };
      expect(service.add(value)).toEqual({ code: 200, value });
    });

    it(`updates the environment store if property added`, () => {
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.add(value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, b: 0, x: { y: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200, value, path} if property added with path`, () => {
      const path = 'b';
      const value = { b: 0 };
      expect(service.add(value, path)).toEqual({ code: 200, value, path });
    });

    it(`updates the environment store if property added with path`, () => {
      const path = 'b';
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.add(value, path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, b: { b: 0 }, x: { y: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'b';
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.add(value, path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, b: { b: 0 }, x: { y: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store overwriting existing object properties`, () => {
      const path = 'x';
      const value = { z: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.add(value, path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { z: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store overwriting existing Array properties`, () => {
      const value = { z: [1] };
      expect(store.update).not.toHaveBeenCalled();
      service.add(value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 0 }, z: [1] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400, path, value} if invalid path`, () => {
      const path = '2z';
      const value = { b: 0 };
      expect(service.add(value, path)).toEqual({ code: 400, path, value });
    });

    it(`ignores the action if invalid path`, () => {
      const path = '2z';
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.add(value, path);
      expect(store.update).not.toHaveBeenCalled();
    });
  });

  describe('merge(properties, path?)', () => {
    beforeEach(() => {
      jest.spyOn(store, 'getAll').mockReturnValue(state);
      jest.spyOn(store, 'update').mockImplementation(() => null);
    });

    it(`returns {code:200, value} if property merged`, () => {
      const value = { b: 0 };
      expect(service.merge(value)).toEqual({ code: 200, value });
    });

    it(`updates the environment store if property merged`, () => {
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.merge(value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, b: 0, x: { y: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:200, value, path} if property merged with path`, () => {
      const path = 'b';
      const value = { b: 0 };
      expect(service.merge(value, path)).toEqual({ code: 200, value, path });
    });

    it(`updates the environment store if property merged with path`, () => {
      const path = 'b';
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.merge(value, path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, b: { b: 0 }, x: { y: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store if immutable environment`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'b';
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.merge(value, path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, b: { b: 0 }, x: { y: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store merging existing object properties`, () => {
      jest.spyOn(store, 'getAll').mockReturnValue(readonlyState);
      const path = 'x';
      const value = { z: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.merge(value, path);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 1, x: { y: 0, z: 0 }, z: [0] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`updates the environment store merging existing Array properties`, () => {
      const value = { z: [1] };
      expect(store.update).not.toHaveBeenCalled();
      service.merge(value);
      expect(store.update).toHaveBeenNthCalledWith(1, { a: 0, x: { y: 0 }, z: [0, 1] });
      expect(store.update).toHaveBeenCalledTimes(1);
    });

    it(`returns {code:400, path, value} if invalid path`, () => {
      const path = '2z';
      const value = { b: 0 };
      expect(service.merge(value, path)).toEqual({ code: 400, path, value });
    });

    it(`ignores the action if invalid path`, () => {
      const path = '2z';
      const value = { b: 0 };
      expect(store.update).not.toHaveBeenCalled();
      service.merge(value, path);
      expect(store.update).not.toHaveBeenCalled();
    });
  });
});
