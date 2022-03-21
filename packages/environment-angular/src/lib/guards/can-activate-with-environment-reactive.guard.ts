import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { EnvironmentQuery } from '@kuoki/environment';
import { delay, filter, Observable, of, race } from 'rxjs';

import { CanActivateWithEnvironment } from './can-activate-with-environment.abstract';

@Injectable()
export class CanActivateWithEnvironmentReactiveGuard extends CanActivateWithEnvironment {
  constructor(protected override readonly router: Router, protected readonly query: EnvironmentQuery) {
    super(router);
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const properties: unknown = this.getProperties(route);

    if (!this.isNotEmptyProperties(properties)) {
      return of(true);
    }

    const dueTime: number = this.getDueTime(route);
    const urlTree: UrlTree | undefined = this.getUrlTree(route);

    const containsAll$: Observable<boolean> = this.query
      .containsAll$(...properties)
      .pipe(filter((contains: boolean) => contains === true));
    const timeout$: Observable<boolean | UrlTree> = of(urlTree ?? false).pipe(delay(dueTime));

    return race([containsAll$, timeout$]);
  }
}
