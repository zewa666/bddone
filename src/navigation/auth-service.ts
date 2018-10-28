import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import auth0 from "auth0-js";

@autoinject()
export class AuthService {
  public auth0 = new auth0.WebAuth({
    clientID: "Ddcw8IGcmGph8RDGi8UaUrP3ve9muur_",
    domain: "bddone.eu.auth0.com",
    redirectUri: "http://localhost:9000/authcb",
    responseType: "token id_token",
    scope: "openid"
  });

  public user: any;

  constructor(private router: AppRouter) { }

  public login() {
    this.auth0.authorize();
  }

  public handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);

        this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
          this.user = user;
          console.log(this.user);
          // This method will make a request to the /userinfo endpoint
          // and return the user object, which contains the user's information,
          // similar to the response below.
          this.router.navigate("planning");
        });
      } else if (err) {
        console.log(err);
      }
    });
  }

  public setSession(authResult) {
    console.log(authResult);
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem("access_token", authResult.accessToken);
    localStorage.setItem("id_token", authResult.idToken);
    localStorage.setItem("expires_at", expiresAt);
  }

  public logout() {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    this.router.navigate("planning");
  }

  public isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expiresAt;
  }
}
