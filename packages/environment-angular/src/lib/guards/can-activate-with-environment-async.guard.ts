import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';

import { delayedPromise } from '../helpers/delayed-promise.function';
import { CanActivateWithEnvironment } from './can-activate-with-environment.abstract';

@Injectable()
export class CanActivateWithEnvironmentAsyncGuard extends CanActivateWithEnvironment {
  constructor(protected override readonly router: Router, protected readonly query: EnvironmentQuery) {
    super(router);
  }

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const properties: unknown = this.getProperties(route);

    if (!this.isNotEmptyProperties(properties)) {
      return Promise.resolve(true);
    }

    const dueTime: number = this.getDueTime(route);
    const urlTree: UrlTree | undefined = this.getUrlTree(route);

    const containsAll: Promise<boolean> = this.query.containsAllAsync(...properties);
    const timeout: PromiseLike<boolean | UrlTree> = delayedPromise(urlTree ?? false, dueTime);

    return Promise.race([containsAll, timeout]);
  }
}
