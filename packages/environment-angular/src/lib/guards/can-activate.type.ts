import { UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export type CanActivateType = boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>;
