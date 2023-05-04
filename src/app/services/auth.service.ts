import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Credentials} from "../models/credentials";
import {User} from "../models/user";
import {HelperService} from "./helper.service";
import {LoginComponent} from "../components/login/login.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticated = {} as User;
  headers = {};

  constructor(private http: HttpClient,
              private helper: HelperService,
              private dialog: MatDialog,
              private router: Router) {

    let user = localStorage.getItem("currentUser");
    let auth = localStorage.getItem("currentAuth");
    if (user != null && auth != null) {
      this.authenticated = JSON.parse(user) as User;
      this.headers = new HttpHeaders({
        authorization: auth
      });
    }
  }

  authenticate(credentials: Credentials, routeTo: string, callback: Function | undefined) {

    let auth = 'Basic ' + btoa(credentials.username + ':' + credentials.password);

    this.getAuth(auth, routeTo, callback);
  }

  auth(routeTo: string, callback: Function | undefined) {
    let auth = localStorage.getItem("currentAuth");
    if (!auth) {
      this.openLoginDialog(routeTo, callback);
    } else {
      this.getAuth(auth, routeTo, callback);
    }
  }

  getAuth(auth: string, routeTo: string, callback: Function | undefined) {
    this.headers =  new HttpHeaders( {
      authorization: auth
    });

    this.http.get<User>('/api/v2/auth', {headers: this.headers}).subscribe(response => {
      if (response) {
        console.log(response);
        this.authenticated = response;
        localStorage.setItem("currentUser", JSON.stringify(response));
        localStorage.setItem("currentAuth", auth);
        if (callback) {
          callback();
        }
        this.router.navigateByUrl(routeTo);
      }
    });
  }

  openLoginDialog(routeTo: string, callback: Function | undefined): void {
    let loginDialog = this.dialog.open(LoginComponent, { disableClose: true });

    loginDialog.afterClosed().subscribe(result => {
      if (this.helper.isNotEmpty(result)) {
        this.handleLoginRequest(result, routeTo, callback);
      }
    })
  }

  handleLoginRequest(credentials: Credentials, routeTo: string, callback: Function | undefined) {
    this.authenticate(credentials, routeTo, callback);
  }

  handleLogoutRequest(routeTo: string): void {
    this.logout(routeTo);
  }

  logout(routeTo: string): void {
    this.authenticated = {} as User;
    this.headers = {};
    localStorage.removeItem("currentUser");
    localStorage.removeItem("currentAuth");
    this.router.navigateByUrl(routeTo);
  }

  isAuthenticated(): boolean {
    return this.helper.isNotEmpty(this.authenticated);
  }

  hasRole(role: string): boolean {
    return this.authenticated.roles?.some(value => value.id == role);
  }

  hasOperation(operation: string): boolean {
    return this.authenticated.roles?.flatMap(role => role.operations).some(value => value.id == operation);
  }
}
