import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { set } from 'lodash-es';
import { delay, of } from 'rxjs';

import { CanActivateWithEnvironmentReactiveGuard } from './can-activate-with-environment-reactive.guard';

describe('CanActivateWithEnvironmentReactiveGuard', () => {
  let spectator: SpectatorService<CanActivateWithEnvironmentReactiveGuard>;
  let query: SpyObject<EnvironmentQuery>;
  let router: SpyObject<Router>;
  let service: any;
  let route: ActivatedRouteSnapshot;
  let resolved: jest.Mock<any, any>;
  let timeout: number;
  let beforeTimeout: number;
  let afterTimeout: number;

  const createService = createServiceFactory({
    service: CanActivateWithEnvironmentReactiveGuard,
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resolved.mockRestore();
  });

  it(`canActivate(route) emits true if properties exists and no timeout`, fakeAsync(() => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true).pipe(delay(beforeTimeout)));
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, true);
  }));

  it(`canActivate(route) emits false if timeout and no urlOnError`, fakeAsync(() => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  }));

  it(`canActivate(route) emits UrlTree if timeout and string urlOnError`, fakeAsync(() => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = 'path/to';
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    router.parseUrl.mockReturnValue(urlTree);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, urlTree);
  }));

  it(`canActivate(route) emits UrlTree if timeout and UrlTree urlOnError`, fakeAsync(() => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = urlTree;
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    router.parseUrl.mockReturnValue(urlTree);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, urlTree);
  }));

  it(`canActivate(route) uses properties from route.data`, fakeAsync(() => {
    service.properties = ['a'];
    jest.spyOn(query, 'containsAll$').mockReturnValue(of(true).pipe(delay(beforeTimeout)));
    set(route, 'data.canActivateWithEnvironment.properties', ['b']);
    spectator.service.canActivate(route).subscribe();

    tick(beforeTimeout);
    expect(query.containsAll$).toHaveBeenNthCalledWith(1, 'b');
  }));

  it(`canActivate(route) emits true if route.data properties is not an array`, fakeAsync(() => {
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    set(route, 'data.canActivateWithEnvironment.properties', null);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, true);

    set(route, 'data.canActivateWithEnvironment.properties', undefined);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(2, true);

    set(route, 'data.canActivateWithEnvironment.properties', 0);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(3, true);
  }));

  it(`canActivate(route) emits true if route.data properties is empty array`, fakeAsync(() => {
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    set(route, 'data.canActivateWithEnvironment.properties', []);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, true);
  }));

  it(`canActivate(route) emits false if route.data properties constains invalid path`, fakeAsync(() => {
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    set(route, 'data.canActivateWithEnvironment.properties', ['2a']);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  }));

  it(`canActivate(route) uses urlOnError from route.data`, fakeAsync(() => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    set(route, 'data.canActivateWithEnvironment.urlOnError', 'path/to');
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    router.parseUrl.mockReturnValue(urlTree);
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, urlTree);
  }));

  it(`canActivate(route) emits false if route.data urlOnError is not string or UrlTree`, fakeAsync(() => {
    service.properties = ['a'];
    set(route, 'data.canActivateWithEnvironment.urlOnError', 0);
    query.containsAll$.andReturn(of(true).pipe(delay(afterTimeout)));
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(timeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  }));

  it(`canActivate(route) uses dueTime from route.data`, fakeAsync(() => {
    service.properties = ['a'];
    const customTimeout = timeout - 10;
    set(route, 'data.canActivateWithEnvironment.dueTime', customTimeout);
    query.containsAll$.andReturn(of(true).pipe(delay(beforeTimeout)));
    spectator.service.canActivate(route).subscribe((v) => resolved(v));

    tick(customTimeout);
    expect(resolved).toHaveBeenNthCalledWith(1, false);
  }));
});
