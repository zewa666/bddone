import { autoinject, bindable } from "aurelia-framework";
import { AppRouter } from "aurelia-router";

import { AuthService } from "../services/auth-service";

@autoinject()
export class Navigation {
  @bindable() public router: AppRouter;

  constructor(private authService: AuthService) { }

  public login() {
    this.authService.login();
  }
}
