import { customAttribute } from "aurelia-framework";
import Awesomplete from "awesomplete";
import { Subscription } from "rxjs";

import { CardService, GWT } from "../card/card-service";

@customAttribute("awesomeplete")
export class Awesomeplete {

  private handle: Awesomplete;
  private subscription: Subscription;
  private value: GWT;

  constructor(
    private element: Element,
    private cardService: CardService
  ) { }

  public bind() {
    Object.defineProperty(this.element, "value", {
      get: () => (this.element as HTMLElement).innerText
    });

    this.handle = new Awesomplete(this.element, {
      list: [],
      minChars: 1,
      replace: (text) => (this.element as HTMLElement).innerText = text
    });

    this.subscription = this.cardService
      .getAvailableCompletions(this.value || "given")
      .subscribe((data) => {
        this.handle.list = data;
      });
  }

  public unbind() {
    this.subscription.unsubscribe();
  }
}
