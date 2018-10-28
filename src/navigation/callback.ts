import { autoinject } from "aurelia-framework";

import { AuthService } from "./auth-service";

@autoinject()
export class Callback {
  constructor(private auth: AuthService) {
    this.auth.handleAuthentication();
  }
}
