import { autoinject } from "aurelia-framework";
import { AppRouter } from "aurelia-router";
import { Store } from "aurelia-store";
import { Subscription } from "rxjs";

import { State } from "./store/state";

@autoinject()
export class App {
  public state: State;
  public router: AppRouter;

  private subscription: Subscription;

  constructor(private store: Store<State>) {
    this.subscription = this.store.state.subscribe((state) => this.state = state);
  }

  public configureRouter(config, router) {
    this.router = router;

    config.title = "BDDone";
    config.map([
      {
        moduleId: "planning/overview",
        name: "planning",
        nav: true,
        route: ["", "planning"],
        title: "Planning"
      },
      {
        href: "card/new",
        moduleId: "card/card-form",
        name: "new-card",
        nav: true,
        route: "card/*idOrNew",
        settings: {
          block: "card-form"
        },
        title: "Add new card"
      }
    ]);
  }

  public detached() {
    this.subscription.unsubscribe();
  }
}
