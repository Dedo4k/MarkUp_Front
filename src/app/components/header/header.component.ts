import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent {

  constructor(private authService: AuthService,
              public router: Router) {
  }

  get auth(): AuthService {
    return this.authService;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get authenticatedUser(): User {
    return this.authService.authenticated;
  }
}
