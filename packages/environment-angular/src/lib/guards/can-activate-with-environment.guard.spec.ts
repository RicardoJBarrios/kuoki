import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery, EnvironmentStore } from '@kuoki/environment';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { set } from 'lodash-es';

import { DefaultEnvironmentQuery } from '../query';
import { DefaultEnvironmentStore } from '../store';
import { CanActivateWithEnvironmentGuard } from './can-activate-with-environment.guard';

describe('CanActivateWithEnvironmentGuard', () => {
  let spectator: SpectatorService<CanActivateWithEnvironmentGuard>;
  let query: EnvironmentQuery;
  let router: SpyObject<Router>;
  let service: any;
  let route: ActivatedRouteSnapshot;

  const createService = createServiceFactory({
    service: CanActivateWithEnvironmentGuard,
    providers: [
      { provide: EnvironmentQuery, useClass: DefaultEnvironmentQuery },
      { provide: EnvironmentStore, useClass: DefaultEnvironmentStore }
    ],
    mocks: [Router]
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
    jest.spyOn(query, 'containsAll').mockReturnValue(true);

    expect(spectator.service.canActivate(route)).toBeTrue();
  });

  it(`canActivate(route) returns false if properties doesn't exist and no urlOnError`, () => {
    service.properties = ['a'];
    jest.spyOn(query, 'containsAll').mockReturnValue(false);

    expect(spectator.service.canActivate(route)).toBeFalse();
  });

  it(`canActivate(route) returns UrlTree if properties doesn't exist and string urlOnError`, () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = 'path/to';
    jest.spyOn(query, 'containsAll').mockReturnValue(false);
    router.parseUrl.mockReturnValue(urlTree);

    expect(spectator.service.canActivate(route)).toEqual(urlTree);
  });

  it(`canActivate(route) returns UrlTree if properties doesn't exist and UrlTree urlOnError`, () => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.urlOnError = urlTree;
    jest.spyOn(query, 'containsAll').mockReturnValue(false);
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
    jest.spyOn(query, 'containsAll').mockReturnValue(false);
    set(route, 'data.canActivateWithEnvironment.properties', null);
    expect(spectator.service.canActivate(route)).toBeTrue();
    set(route, 'data.canActivateWithEnvironment.properties', undefined);
    expect(spectator.service.canActivate(route)).toBeTrue();
    set(route, 'data.canActivateWithEnvironment.properties', 0);
    expect(spectator.service.canActivate(route)).toBeTrue();
  });

  it(`canActivate(route) returns true if route.data properties is empty array`, () => {
    jest.spyOn(query, 'containsAll').mockReturnValue(false);
    set(route, 'data.canActivateWithEnvironment.properties', []);
    expect(spectator.service.canActivate(route)).toBeTrue();
  });

  it(`canActivate(route) uses urlOnError from route.data`, () => {
    service.properties = ['a'];
    service.urlOnError = 'path/to';
    const dataUrlOnError = 'data/path';
    jest.spyOn(query, 'containsAll').mockReturnValue(false);
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
    jest.spyOn(query, 'containsAll').mockReturnValue(false);
    set(route, 'data.canActivateWithEnvironment.urlOnError', dataUrlOnError);

    expect(spectator.service.canActivate(route)).toBeFalse();
  });
});
