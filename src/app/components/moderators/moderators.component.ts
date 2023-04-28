import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {RolesService} from "../../services/roles.service";
import {ModeratorCreateComponent} from "./moderator-create/moderator-create.component";
import {ModeratorsService} from "../../services/moderators.service";
import {ModeratorEditComponent} from "./moderator-edit/moderator-edit.component";

@Component({
  selector: 'app-moderators',
  templateUrl: './moderators.component.html',
  styleUrls: ['./moderators.component.sass']
})
export class ModeratorsComponent {

  constructor(private authService: AuthService,
              private dialog: MatDialog,
              private rolesService: RolesService,
              private moderatorsService: ModeratorsService) {
    if (!authService.isAuthenticated()) {
      authService.openLoginDialog("/moderators");
    }
  }

  get auth() {
    return this.authService.authenticated;
  }

  openModeratorCreateDialog() {
    this.rolesService.getAllRoles()
      .subscribe(res => {
        let createModeratorDialog = this.dialog.open(ModeratorCreateComponent, {
          data: {
            roles: res,
            datasets: this.auth.datasets
          }
        });

        createModeratorDialog.afterClosed().subscribe(res => {
          this.moderatorsService.createModerator(res)
            .subscribe(res => {
              this.auth.moderators.push(res);
              localStorage.setItem("currentUser", JSON.stringify(this.auth));
            })
        });
      });
  }

  deleteModerator(id: number) {
    if (confirm("Are you really want to delete moderator with id: " + id)) {
      this.moderatorsService.deleteModerator(id)
        .subscribe(res => {
          this.auth.moderators.splice(this.auth.moderators.findIndex(m => m.id === id), 1);
          localStorage.setItem("currentUser", JSON.stringify(this.auth));
        });
    }
  }

  editModerator(id: number) {
    this.rolesService.getAllRoles().subscribe(res => {
      let updateModeratorDialog = this.dialog.open(ModeratorEditComponent, {
        data: {
          moderator: this.auth.moderators.find(m => m.id === id),
          roles: res,
          datasets: this.auth.datasets
        }
      });

      updateModeratorDialog.afterClosed().subscribe(res => {
        this.moderatorsService.updateModerator(id, res)
          .subscribe(res => {
            this.auth.moderators.splice(this.auth.moderators.findIndex(m => m.id === id), 1);
            this.auth.moderators.push(res);
            localStorage.setItem("currentUser", JSON.stringify(this.auth));
          })
      })
    })
  }
}
