import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {CreateUserDto, Moderator} from "../models/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModeratorsService {

  apiUrl = "/api/v2/moderators"

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  createModerator(userDto: CreateUserDto): Observable<Moderator> {
    return this.http.post<Moderator>(this.apiUrl + "/create", userDto, {headers: this.authService.headers});
  }
}
