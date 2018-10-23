import { bindable } from "aurelia-framework";
import { AppRouter } from "aurelia-router";

export class Navigation {
  @bindable() public router: AppRouter;
}
