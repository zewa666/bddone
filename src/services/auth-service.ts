import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import { Store } from "aurelia-store";
import auth0, { Auth0Error } from "auth0-js";
import { pluck } from "rxjs/operators";

import { loginUser, logoutUser } from "../store/actions";
import { State } from "../store/state";

@autoinject()
export class AuthService {
  public auth0 = new auth0.WebAuth({
    clientID: "Ddcw8IGcmGph8RDGi8UaUrP3ve9muur_",
    domain: "bddone.eu.auth0.com",
    redirectUri: `${window.location.origin}${!window.location.origin.includes("localhost") ? "/bddone" :  "" }/authcb`,
    responseType: "token id_token",
    scope: "openid profile"
  });

  public user: auth0.Auth0UserProfile;

  constructor(
    private router: AppRouter,
    private store: Store<State>
  ) {
    this.store.state.pipe(pluck<State, auth0.AdfsUserProfile>("user")).subscribe((u) => {
      this.user = u;
    });
  }

  public login() {
    this.auth0.authorize();
  }

  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.auth0.client.userInfo(authResult.accessToken, async (uInfoErr: Auth0Error, user) => {
          if (uInfoErr) {
            // tslint:disable-next-line:no-console
            console.error(uInfoErr);
            return;
          }
          this.user = user;
          // This method will make a request to the /userinfo endpoint
          // and return the user object, which contains the user's information,
          // similar to the response below.
          await this.store.dispatch(loginUser, authResult, user);

          this.router.navigate("planning");
        });
      } else if (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
      }
    });
  }

  public async logout() {
    // Clear Access Token and ID Token from local storage
    await this.store.dispatch(logoutUser);
    this.router.navigate("planning");
  }

  public isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
}
