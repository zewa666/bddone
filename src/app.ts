import { autoinject } from "aurelia-framework";
import { AppRouter, NavigationInstruction, RouteConfig } from "aurelia-router";
import { localStorageMiddleware, MiddlewarePlacement, rehydrateFromLocalStorage, Store } from "aurelia-store";
import { Subscription } from "rxjs";

import { State } from "./store/state";

@autoinject()
export class App {
  public state: State;
  public router: AppRouter;

  private subscription: Subscription;

  constructor(private store: Store<State>) {
    this.store.registerAction("Rehydrate", rehydrateFromLocalStorage);
    this.store.dispatch(rehydrateFromLocalStorage);
    this.store.registerMiddleware(localStorageMiddleware, MiddlewarePlacement.After);
    this.subscription = this.store.state.subscribe((state) => this.state = state);
  }

  public configureRouter(config, router) {
    this.router = router;

    config.title = "BDDone";
    config.options.pushState = true;
    if (window.location.href.includes("/bddone/")) {
      config.options.root = "/bddone/";
    }

    const handleUnknownRoutes = (instruction: NavigationInstruction): RouteConfig => {
      if (instruction.fragment.startsWith("/access_token")) {
        instruction.config = {} as any;
        instruction.config.name = "callback";
        instruction.config.moduleId = "navigation/callback";
        instruction.config.route = "authcb";
        instruction.config.redirect = "authcb" + instruction.fragment.replace("/", "#");

        return instruction.config;
      }

      if (instruction.fragment.startsWith("authcb#access_token")) {
        instruction.config = {} as any;
        instruction.config.name = "callback";
        instruction.config.moduleId = "navigation/callback";
        instruction.config.route = instruction.fragment;

        return instruction.config;
      }
    };

    config.mapUnknownRoutes(handleUnknownRoutes);

    config.map([
      {
        moduleId: "planning/overview",
        name: "planning",
        nav: true,
        route: ["", "planning"],
        settings: {
          bem: "overview"
        },
        title: "Planning"
      },
      {
        href: "card/new",
        moduleId: "card/card-form",
        name: "new-card",
        nav: true,
        route: "card/*idOrNew",
        settings: {
          bem: "card-form card-form--routed"
        },
        title: "Add new card"
      },
      {
        moduleId: "navigation/callback",
        name: "callback",
        nav: false,
        route: "authcb",
        title: "Auth callback"
      }
    ]);
  }

  public detached() {
    this.subscription.unsubscribe();
  }
}
