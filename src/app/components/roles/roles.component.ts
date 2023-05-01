import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {Operation, Role} from "../../models/user";
import {RolesService} from "../../services/roles.service";
import {RoleCreateComponent} from "./role-create/role-create.component";
import {RoleEditComponent} from "./role-edit/role-edit.component";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.sass']
})
export class RolesComponent {

  roles: Role[] = [];
  operations: Operation[] = [];
  loading = false;

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private roleService: RolesService) {
    authService.auth("/roles", () => {
      this.loading = true;
      this.roleService.getAllRoles()
        .subscribe(res => {
          this.loading = false;
          this.roles = res;
        });
    });
  }

  openCreateRoleDialog() {
    this.roleService.getAllOperations().subscribe(res => {
      let createRoleDialog = this.dialog.open(RoleCreateComponent, {data: res});

      createRoleDialog.afterClosed().subscribe(res => {
        this.roleService.createRole(res).subscribe(res => this.roles.push(res));
      })
    })
  }

  openEditRoleDialog(id: string) {
    this.roleService.getAllOperations().subscribe(res => {
      let editRoleDialog = this.dialog.open(RoleEditComponent, {
        data: {
          role: this.roles.find(role => role.id === id),
          operations: res
        }
      });

      editRoleDialog.afterClosed().subscribe(res => {
        this.roleService.editRole(id, res).subscribe(res => {
          this.roles.splice(this.roles.findIndex(role => role.id === res.id), 1);
          this.roles.push(res);
        });
      })
    })
  }

  deleteRole(id: string) {
    if (confirm("Do you really want to delete the role with id: " + id)) {
      this.roleService.deleteRole(id).subscribe(res => {
        this.roles.splice(this.roles.findIndex(role => role.id === id), 1);
      })
    }
  }
}
