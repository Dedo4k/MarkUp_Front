import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {RolesService} from "../../services/roles.service";
import {ModeratorCreateComponent} from "./moderator-create/moderator-create.component";
import {ModeratorsService} from "../../services/moderators.service";

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
              console.log(res);
              this.auth.moderators.push(res);
              localStorage.setItem("currentUser", JSON.stringify(this.auth));
            })
        });
      });
  }
}
