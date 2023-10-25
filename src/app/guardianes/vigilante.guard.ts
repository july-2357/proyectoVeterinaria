import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VigilanteGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

   return true; //Se estadejando entrear (true)
   // return this.checkUserLogin(route);
  }
  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    const roles = this.cookieService.get('rol');
    alert(roles);
    if(roles==route.data['rol']){

      return true;
    }
    return false;
  }
}
