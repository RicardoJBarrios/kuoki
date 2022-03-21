import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { set } from 'lodash-es';

import { CanActivateWithEnvironmentGuard } from './can-activate-with-environment.guard';

describe('CanActivateWithEnvironmentGuard', () => {
  let spectator: SpectatorService<CanActivateWithEnvironmentGuard>;
  let query: SpyObject<EnvironmentQuery>;
  let router: SpyObject<Router>;
  let service: any;
  let route: ActivatedRouteSnapshot;

  const createService = createServiceFactory({
    service: CanActivateWithEnvironmentGuard,
    mocks: [EnvironmentQuery, Router]
  });

  beforeEach(() => {
    spectator = createService();
    query = spectator.inject(EnvironmentQuery);
    router = spectator.inject(Router);
    service = spectator.service;
    route = expect.any(ActivatedRouteSnapshot);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it(`canActivate(route) returns true if properties exists`, () => {
    service.properties = ['a'];
    query.containsAll.andReturn(true);

    expect(spectator.service.canActivate(route)).toBeTrue();
  });

  it(`canActivate(route) returns false if properties doesn't exist and no urlOnError`, () => {
    service.properties = ['a'];
    query.containsAll.andReturn(false);

    expect(spectator.service.canActivate(route)).toBeFalse();
  });

  it(`canActivate(route) returns UrlTree if properties doesn't exist and string urlOnError`, () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = 'path/to';
    query.containsAll.andReturn(false);
    router.parseUrl.mockReturnValue(urlTree);

    expect(spectator.service.canActivate(route)).toEqual(urlTree);
  });

  it(`canActivate(route) returns UrlTree if properties doesn't exist and UrlTree urlOnError`, () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = urlTree;
    query.containsAll.andReturn(false);
    router.parseUrl.mockReturnValue(urlTree);

    expect(spectator.service.canActivate(route)).toEqual(urlTree);
  });

  it(`canActivate(route) uses properties from route.data`, () => {
    service.properties = ['a'];
    jest.spyOn(query, 'containsAll').mockReturnValue(true);
    spectator.service.canActivate(route);

    expect(query.containsAll).toHaveBeenNthCalledWith(1, 'a');

    set(route, 'data.canActivateWithEnvironment.properties', ['b']);
    spectator.service.canActivate(route);

    expect(query.containsAll).toHaveBeenNthCalledWith(2, 'b');
  });

  it(`canActivate(route) returns true if route.data properties is not an array`, () => {
    query.containsAll.andReturn(false);
    set(route, 'data.canActivateWithEnvironment.properties', null);
    expect(spectator.service.canActivate(route)).toBeTrue();
    set(route, 'data.canActivateWithEnvironment.properties', undefined);
    expect(spectator.service.canActivate(route)).toBeTrue();
    set(route, 'data.canActivateWithEnvironment.properties', 0);
    expect(spectator.service.canActivate(route)).toBeTrue();
  });

  it(`canActivate(route) returns true if route.data properties is empty array`, () => {
    query.containsAll.andReturn(false);
    set(route, 'data.canActivateWithEnvironment.properties', []);
    expect(spectator.service.canActivate(route)).toBeTrue();
  });

  it(`canActivate(route) returns false if route.data properties constains invalid path`, () => {
    query.containsAll.andReturn(false);
    set(route, 'data.canActivateWithEnvironment.properties', ['2a']);
    expect(spectator.service.canActivate(route)).toBeFalse();
  });

  it(`canActivate(route) uses urlOnError from route.data`, () => {
    service.properties = ['a'];
    service.urlOnError = 'path/to';
    const dataUrlOnError = 'data/path';
    query.containsAll.andReturn(false);
    jest.spyOn(router, 'parseUrl');
    spectator.service.canActivate(route);

    expect(router.parseUrl).toHaveBeenNthCalledWith(1, service.urlOnError);

    set(route, 'data.canActivateWithEnvironment.urlOnError', dataUrlOnError);
    spectator.service.canActivate(route);

    expect(router.parseUrl).toHaveBeenNthCalledWith(2, dataUrlOnError);
  });

  it(`canActivate(route) returns false if route.data urlOnError is not string or UrlTree`, () => {
    service.properties = ['a'];
    const dataUrlOnError = 0;
    query.containsAll.andReturn(false);
    set(route, 'data.canActivateWithEnvironment.urlOnError', dataUrlOnError);

    expect(spectator.service.canActivate(route)).toBeFalse();
  });
});
