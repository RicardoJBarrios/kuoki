import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';
import { createServiceFactory, createSpyObject, SpectatorService, SpyObject } from '@ngneat/spectator/jest';
import { set } from 'lodash-es';
import { delay, of, Subscription } from 'rxjs';

import { DefaultEnvironmentQuery } from '../query';
import { CanActivateEnvironment } from './can-activate-environment.guard';

describe('CanActivateWithEnvironment', () => {
  let spectator: SpectatorService<CanActivateEnvironment>;
  let query: SpyObject<EnvironmentQuery>;
  let router: SpyObject<Router>;
  let service: any;
  let route: ActivatedRouteSnapshot;
  let sub: Subscription;

  const createService = createServiceFactory({
    service: CanActivateEnvironment,
    providers: [{ provide: EnvironmentQuery, useValue: createSpyObject(DefaultEnvironmentQuery) }],
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
    sub.unsubscribe();
    query.containsAll$.mockRestore();
    router.parseUrl.mockRestore();
  });

  it(`canActivate(route) emits true if properties exists and no timeout`, (done) => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true));

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(true);
      done();
    });
  });

  it(`canActivate(route) emits true if properties exists before timeout`, (done) => {
    service.properties = ['a'];
    service.dueTime = 5;
    query.containsAll$.andReturn(of(true));

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(true);
      done();
    });
  });

  it(`canActivate(route) never emits if properties doesn't exists and no timeout`, fakeAsync(() => {
    const mockFn = jest.fn();
    service.properties = ['a'];
    query.containsAll$.andReturn(of(false));

    sub = spectator.service.canActivate(route).subscribe(() => mockFn());

    tick(1000);
    expect(mockFn).not.toHaveBeenCalled();
  }));

  it(`canActivate(route) emits false if properties exists, timeout and no urlOnError`, (done) => {
    service.properties = ['a'];
    service.dueTime = 5;
    query.containsAll$.andReturn(of(true).pipe(delay(10)));

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(false);
      done();
    });
  });

  it(`canActivate(route) emits false if properties doesn't exist, timeout and no urlOnError`, (done) => {
    service.properties = ['a'];
    service.dueTime = 5;
    query.containsAll$.andReturn(of(false));

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(false);
      done();
    });
  });

  it(`canActivate(route) emits UrlTree if properties doesn't exists, timeout and string urlOnError`, (done) => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.dueTime = 5;
    service.urlOnError = 'path/to';
    query.containsAll$.andReturn(of(false));
    router.parseUrl.andReturn(urlTree);

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(urlTree);
      done();
    });
  });

  it(`canActivate(route) emits UrlTree if properties doesn't exists, timeout and UrlTree urlOnError`, (done) => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.dueTime = 5;
    service.urlOnError = urlTree;
    query.containsAll$.andReturn(of(false));

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(urlTree);
      done();
    });
  });

  it(`canActivate(route) uses properties from route.data`, (done) => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true));
    set(route, 'data.canActivateEnvironment.properties', ['b']);

    sub = spectator.service.canActivate(route).subscribe(() => {
      expect(query.containsAll$).toHaveBeenNthCalledWith(1, 'b');
      done();
    });
  });

  it(`canActivate(route) emits true if route.data properties is not an array`, (done) => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true));
    set(route, 'data.canActivateEnvironment.properties', null);

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(true);
      done();
    });
  });

  it(`canActivate(route) emits true if route.data properties is empty array`, (done) => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true));
    set(route, 'data.canActivateEnvironment.properties', []);

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(true);
      done();
    });
  });

  it(`canActivate(route) uses dueTime from route.dueTime`, (done) => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true).pipe(delay(10)));
    set(route, 'data.canActivateEnvironment.dueTime', 5);

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(false);
      done();
    });
  });

  it(`canActivate(route) ignores route.dueTime if isn't a number`, (done) => {
    service.properties = ['a'];
    query.containsAll$.andReturn(of(true).pipe(delay(10)));
    set(route, 'data.canActivateEnvironment.dueTime', '5');

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(true);
      done();
    });
  });

  it(`canActivate(route) uses urlOnError from route.data`, (done) => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.dueTime = 5;
    set(route, 'data.canActivateEnvironment.urlOnError', 'path/to');
    query.containsAll$.andReturn(of(false));
    router.parseUrl.andReturn(urlTree);

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toEqual(urlTree);
      done();
    });
  });

  it(`canActivate(route) emits false if route.data urlOnError is not string or UrlTree`, (done) => {
    const urlTree: UrlTree = new UrlTree();
    service.properties = ['a'];
    service.dueTime = 5;
    set(route, 'data.canActivateEnvironment.urlOnError', 0);
    query.containsAll$.andReturn(of(false));

    sub = spectator.service.canActivate(route).subscribe((v) => {
      expect(v).toBeFalse();
      done();
    });
  });
});
