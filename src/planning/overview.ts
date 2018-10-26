import { connectTo } from "aurelia-store";
import { distinctUntilChanged } from "rxjs/operators";

import { State } from "../store/state";

@connectTo((store) => store.state.pipe(distinctUntilChanged()))
export class Overview {
  public state: State;
  public btnExport: HTMLAnchorElement;

  public stateChanged(newState) {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(newState));

    this.btnExport.setAttribute("href", dataStr);

    return true;
  }
}
