import { autoinject } from "aurelia-framework";

import { AuthService } from "../services/auth-service";

@autoinject()
export class Callback {
  constructor(private auth: AuthService) {
    this.auth.handleAuthentication();
  }
}
