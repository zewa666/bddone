import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import { State } from "../store/state";

export type GWT = "given" | "when" | "then";

@autoinject()
export class CardService {
  private state: State;

  constructor(private store: Store<State>) {
    this.store.state.subscribe((s) => this.state = s);
  }

  public getAvailableCompletions(type: GWT) {
    return this.state.cards.map(
      (c) => c[type]
    ).sort();
  }
}
