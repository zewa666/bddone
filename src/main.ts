import { Aurelia } from "aurelia-framework";
import { initialState } from "store/state";
import environment from "./environment";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature("card")
    .globalResources([
      "./navigation/navigation",
      "./planning/overview"
    ]);

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  aurelia.use.plugin("aurelia-store", {
    initialState,
    logDispatchedActions: true
  });

  return aurelia.start().then(() => aurelia.setRoot());
}
