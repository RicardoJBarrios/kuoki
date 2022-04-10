import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AtLeastOne, EnvironmentQuery, Path } from '@kuoki/environment';
import { get } from 'lodash-es';
import { delay, filter, merge, Observable, of } from 'rxjs';

/**
 * Prevent path to be activated if required environment properties doesn't exist.
 */
@Injectable()
export class CanActivateEnvironment {
  /**
   * The array of properties needed to activate the path.
   */
  protected readonly properties?: AtLeastOne<Path>;

  /**
   * The path to redirect on activation error.
   */
  protected readonly urlOnError?: string | UrlTree;

  /**
   * The time to wait until properties are resolved.
   */
  protected readonly dueTime?: number;

  /**
   * The path to manage properties on route Data.
   */
  protected readonly dataPath = 'canActivateEnvironment';

  constructor(protected readonly router: Router, protected readonly query: EnvironmentQuery) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const properties: unknown = this.getProperties(route);

    if (!this.isNotEmptyProperties(properties)) {
      return of(true);
    }

    const dueTime: number | undefined = this.getDueTime(route);
    const urlTree: UrlTree | undefined = this.getUrlTree(route);

    const containsAll$: Observable<boolean> = this.query
      .containsAll$(...properties)
      .pipe(filter((value: boolean) => value === true));

    if (dueTime != null) {
      const timeout$: Observable<boolean | UrlTree> = of(urlTree ?? false).pipe(delay(dueTime));

      return merge(timeout$, containsAll$);
    }

    return containsAll$;
  }

  protected getProperties(route: ActivatedRouteSnapshot): unknown {
    return get(route, `data.${this.dataPath}.properties`, this.properties);
  }

  protected getUrlTree(route: ActivatedRouteSnapshot): UrlTree | undefined {
    const urlOnError: unknown = get(route, `data.${this.dataPath}.urlOnError`, this.urlOnError);

    if (typeof urlOnError === 'string') {
      return this.router.parseUrl(urlOnError);
    }

    return urlOnError instanceof UrlTree ? urlOnError : undefined;
  }

  protected isNotEmptyProperties(properties: unknown): properties is AtLeastOne<Path> {
    return properties != null && Array.isArray(properties) && properties.length > 0;
  }

  protected getDueTime(route: ActivatedRouteSnapshot): number | undefined {
    const due: unknown = get(route, `data.${this.dataPath}.dueTime`);

    return typeof due === 'number' ? due : this.dueTime;
  }
}
