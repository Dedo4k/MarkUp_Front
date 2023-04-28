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

  authenticate(credentials: Credentials, routeTo: string) {

    let auth = 'Basic ' + btoa(credentials.username + ':' + credentials.password);

    this.headers =  new HttpHeaders(credentials ? {
        authorization: auth
      } : {});

    this.http.get<User>('/api/v2/auth', {headers: this.headers}).subscribe(response => {
      if (response) {
        this.authenticated = response;
        localStorage.setItem("currentUser", JSON.stringify(response));
        localStorage.setItem("currentAuth", auth);
        this.router.navigateByUrl(routeTo);
      }
    });
  }

  openLoginDialog(routeTo: string): void {
    let loginDialog = this.dialog.open(LoginComponent);

    loginDialog.afterClosed().subscribe(result => {
      if (this.helper.isNotEmpty(result)) {
        this.handleLoginRequest(result, routeTo);
      }
    })
  }

  handleLoginRequest(credentials: Credentials, routeTo: string) {
    this.authenticate(credentials, routeTo);
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
}
