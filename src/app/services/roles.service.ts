import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {CreateRoleDto, EditRoleDto, Operation, Role} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  apiUrl = "/api/v2/roles"

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl, {headers: this.authService.headers});
  }

  getAllOperations(): Observable<Operation[]> {
    return this.http.get<Operation[]>(this.apiUrl + "/ops", {headers: this.authService.headers});
  }

  createRole(createRoleDto: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(this.apiUrl + "/create", createRoleDto, {headers: this.authService.headers});
  }

  editRole(id: string, editRoleDto: EditRoleDto): Observable<Role> {
    return this.http.put<Role>(this.apiUrl + "/" + id, editRoleDto, {headers: this.authService.headers});
  }

  deleteRole(id: string) {
    return this.http.delete<Role>(this.apiUrl + "/" + id, {headers: this.authService.headers});
  }
}
