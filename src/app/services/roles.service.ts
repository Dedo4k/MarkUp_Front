import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Role} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  apiUrl = "/api/v2/roles"

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl, {headers: this.authService.headers});
  }
}
