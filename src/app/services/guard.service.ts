import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return true;
  }
}
