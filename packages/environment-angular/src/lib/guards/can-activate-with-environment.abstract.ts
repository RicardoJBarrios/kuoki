import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AtLeastOne, Path } from '@kuoki/environment';
import { get } from 'lodash-es';

import { CanActivateType } from './can-activate.type';

export abstract class CanActivateWithEnvironment implements CanActivate {
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
  protected readonly dueTime: number = 5000;
  /**
   * The path to manage properties on route Data.
   */
  protected readonly dataPath = 'canActivateWithEnvironment';

  constructor(protected readonly router: Router) {}

  abstract canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CanActivateType;

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

  protected getDueTime(route: ActivatedRouteSnapshot): number {
    const due: unknown = get(route, `data.${this.dataPath}.dueTime`);

    return typeof due === 'number' ? due : this.dueTime;
  }
}
