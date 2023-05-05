import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      let section = route.url[0].path;
      switch (section) {
        case "moderators": {
          if (!this.authService.hasOperation("OP_MODERATOR_READ")) {
            window.alert("Permission denied.");
            this.router.navigateByUrl("/");
            return false;
          }
          break;
        }
        case "roles": {
          if (!this.authService.hasOperation("OP_ROLE_READ")) {
            window.alert("Permission denied.");
            this.router.navigateByUrl("/");
            return false;
          }
          break;
        }
        case "display": {
          if (!this.authService.hasOperation("OP_DATASET_READ")) {
            window.alert("Permission denied.");
            this.router.navigateByUrl("/datasets");
            return false;
          } else {
            let datasetName = route.url[1]?.path;
            if (!this.authService.authenticated.datasets.some(dataset => dataset.name === datasetName)) {
              window.alert("Permission denied.");
              this.router.navigateByUrl("/datasets");
              return false;
            }
          }
          break;
        }
      }
      return true;
    } else {
      window.alert("You are not authorized.");
      return false;
    }
  }
}
