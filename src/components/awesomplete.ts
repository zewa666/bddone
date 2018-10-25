import { customAttribute } from "aurelia-framework";
import Awesomplete from "awesomplete";

import { CardService, GWT } from "../card/card-service";

@customAttribute("awesomeplete")
export class Awesomeplete {

  private handle: Awesomplete;
  private value: GWT;

  constructor(
    private element: Element,
    private cardService: CardService
  ) {}

  public attached() {
    Object.defineProperty(this.element, "value", {
      get: () => (this.element as HTMLElement).innerText
    });

    this.handle = new Awesomplete(this.element, {
      list: this.cardService.getAvailableCompletions(this.value || "given"),
      replace: (text) => (this.element as HTMLElement).innerText = text
    });
  }
}
