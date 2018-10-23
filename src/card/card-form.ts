import { autoinject, bindable, TaskQueue } from "aurelia-framework";
import { Store } from "aurelia-store";

import { saveCard } from "../store/actions";
import { Card } from "../store/models";
import { State } from "../store/state";

@autoinject()
export class CardForm {
  @bindable() public card: Card;
  public given: HTMLTextAreaElement;
  public editedCard: Card;
  public isEditable: boolean = false;

  private routed: boolean = false;

  constructor(
    private store: Store<State>,
    private taskQueue: TaskQueue
  ) { }

  public activate(params) {
    if (params.idOrNew === "new") {
      this.createEmptyCard();
      this.routed = true;
      this.isEditable = true;
    }
  }

  public cardChanged() {
    if (this.card) {
      this.editedCard = Object.assign({}, this.card);
    }
  }

  public saveCard() {
    this.store.dispatch(saveCard, this.editedCard);

    if (this.routed) {
      this.createEmptyCard();
      this.given.focus();
    } else {
      this.isEditable = false;
    }
  }

  public editCard() {
    this.isEditable = true;

    this.taskQueue.queueTask(() => {
      this.given.focus();

      if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(this.given);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
  }

  public cancel() {
    this.editedCard = Object.assign({}, this.card);
    this.isEditable = false;
  }

  private createEmptyCard() {
    this.editedCard = { given: "", when: "", then: "" };
  }
}
