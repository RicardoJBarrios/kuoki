import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { install, InstalledClock } from '@sinonjs/fake-timers';
import { set } from 'lodash-es';

import { delayedPromise } from '../helpers';
import { CanActivateWithEnvironmentAsyncGuard } from './can-activate-with-environment-async.guard';

describe('CanActivateWithEnvironmentAsyncGuard', () => {
  let spectator: SpectatorService<CanActivateWithEnvironmentAsyncGuard>;
  let query: SpyObject<EnvironmentQuery>;
  let router: SpyObject<Router>;
  let service: any;
  let route: ActivatedRouteSnapshot;
  let clock: InstalledClock;
  let resolved: jest.Mock<any, any>;
  let timeout: number;
  let beforeTimeout: number;
  let afterTimeout: number;

  const createService = createServiceFactory({
    service: CanActivateWithEnvironmentAsyncGuard,
    mocks: [EnvironmentQuery, Router]
  });

  beforeEach(() => {
    spectator = createService();
    query = spectator.inject(EnvironmentQuery);
    router = spectator.inject(Router);
    service = spectator.service;
    route = expect.any(ActivatedRouteSnapshot);
    resolved = jest.fn();
    timeout = service.dueTime;
    beforeTimeout = timeout - 1;
    afterTimeout = timeout + 1;
    clock = install();
  });

  afterEach(() => {
    clock.uninstall();
    jest.restoreAllMocks();
    resolved.mockRestore();
  });

  it(`canActivate(route) resolves true if properties exists and no timeout`, async () => {
    service.properties = ['a'];
    query.containsAllAsync.andReturn(delayedPromise(true, beforeTimeout));
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(beforeTimeout);
    expect(resolved).toHaveBeenNthCalledWith(1, true);
  });

  it(`canActivate(route) resolves false if timeout and no urlOnError`, async () => {
    service.properties = ['a'];
    query.containsAllAsync.andReturn(delayedPromise(true, afterTimeout));
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  });

  it(`canActivate(route) resolves UrlTree if timeout and string urlOnError`, async () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = 'path/to';
    query.containsAllAsync.andReturn(delayedPromise(true, afterTimeout));
    router.parseUrl.mockReturnValue(urlTree);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, urlTree);
  });

  it(`canActivate(route) resolves UrlTree if timeout and UrlTree urlOnError`, async () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = urlTree;
    query.containsAllAsync.andReturn(delayedPromise(true, afterTimeout));
    router.parseUrl.mockReturnValue(urlTree);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, urlTree);
  });

  it(`canActivate(route) uses properties from route.data`, async () => {
    jest.spyOn(query, 'containsAllAsync').mockReturnValue(delayedPromise(true, beforeTimeout));
    set(route, 'data.canActivateWithEnvironment.properties', ['b']);
    spectator.service.canActivate(route);

    await clock.tickAsync(beforeTimeout);
    expect(query.containsAllAsync).toHaveBeenNthCalledWith(1, 'b');
  });

  it(`canActivate(route) resolves true if route.data properties is not an array`, async () => {
    jest.spyOn(query, 'containsAllAsync').mockReturnValue(delayedPromise(true, afterTimeout));
    set(route, 'data.canActivateWithEnvironment.properties', null);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, true);

    set(route, 'data.canActivateWithEnvironment.properties', undefined);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(2, true);

    set(route, 'data.canActivateWithEnvironment.properties', 0);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(3, true);
  });

  it(`canActivate(route) resolves true if route.data properties is empty array`, async () => {
    jest.spyOn(query, 'containsAllAsync').mockReturnValue(delayedPromise(true, afterTimeout));
    set(route, 'data.canActivateWithEnvironment.properties', []);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, true);
  });

  it(`canActivate(route) resolves false if route.data properties constains invalid path`, async () => {
    jest.spyOn(query, 'containsAllAsync').mockReturnValue(delayedPromise(true, afterTimeout));
    set(route, 'data.canActivateWithEnvironment.properties', ['2a']);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  });

  it(`canActivate(route) uses urlOnError from route.data`, async () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    set(route, 'data.canActivateWithEnvironment.urlOnError', 'path/to');
    query.containsAllAsync.andReturn(delayedPromise(true, afterTimeout));
    router.parseUrl.mockReturnValue(urlTree);
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, urlTree);
  });

  it(`canActivate(route) resolves false if route.data urlOnError is not string or UrlTree`, async () => {
    service.properties = ['a'];
    set(route, 'data.canActivateWithEnvironment.urlOnError', 0);
    query.containsAllAsync.andReturn(delayedPromise(true, afterTimeout));
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  });

  it(`canActivate(route) uses dueTime from route.data`, async () => {
    service.properties = ['a'];
    const customTimeout = timeout - 10;
    set(route, 'data.canActivateWithEnvironment.dueTime', customTimeout);
    query.containsAllAsync.andReturn(delayedPromise(true, beforeTimeout));
    spectator.service.canActivate(route).then((v) => resolved(v));

    await clock.tickAsync(customTimeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  });
});
