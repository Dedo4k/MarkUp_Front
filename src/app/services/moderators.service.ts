import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {CreateUserDto, EditUserDto, Moderator, User} from "../models/user";
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

  deleteModerator(id: number): Observable<Moderator> {
    return this.http.delete<Moderator>(this.apiUrl + "/" + id, {headers: this.authService.headers});
  }

  updateModerator(id: number, editUserDto: EditUserDto): Observable<Moderator> {
    return this.http.put<Moderator>(this.apiUrl + "/" + id, editUserDto, {headers: this.authService.headers});
  }
}
