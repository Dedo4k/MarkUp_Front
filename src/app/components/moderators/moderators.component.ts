import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-moderators',
  templateUrl: './moderators.component.html',
  styleUrls: ['./moderators.component.sass']
})
export class ModeratorsComponent {

  constructor(private authService: AuthService) {
    if (!authService.isAuthenticated()) {
      authService.openLoginDialog("/moderators");
    }
  }


}
