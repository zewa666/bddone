import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { map, pluck } from "rxjs/operators";

import { Card } from "../store/models";
import { State } from "../store/state";

export type GWT = "given" | "when" | "then";

@autoinject()
export class CardService {
  constructor(private store: Store<State>) {}

  public getAvailableCompletions(type: GWT) {
    return this.store.state.pipe(
      pluck<State, Card[]>("cards"),
      map((cards) => cards.map((c) => c[type]))
    );
  }
}
