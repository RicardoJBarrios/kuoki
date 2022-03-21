import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';

import { CanActivateWithEnvironment } from './can-activate-with-environment.abstract';

@Injectable()
export class CanActivateWithEnvironmentGuard extends CanActivateWithEnvironment {
  constructor(protected override readonly router: Router, protected readonly query: EnvironmentQuery) {
    super(router);
  }

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const properties: unknown = this.getProperties(route);

    if (!this.isNotEmptyProperties(properties)) {
      return true;
    }

    const urlTree: UrlTree | undefined = this.getUrlTree(route);
    const containsAll: boolean = this.query.containsAll(...properties);

    return containsAll ? containsAll : urlTree ?? false;
  }
}
