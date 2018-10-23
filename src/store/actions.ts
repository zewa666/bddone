import { Container } from "aurelia-framework";
import { Store } from "aurelia-store";
import uuid from "uuid/v1";

import { Card } from "./models";
import { State } from "./state";

const store = Container.instance.get(Store) as Store<State>;

export function saveCard(state: State, model: Card) {
  const clone = Object.assign({}, state);

  if (model.id) {
    const idx = clone.cards.findIndex((c) => c.id === model.id);

    clone.cards = [
      ...clone.cards.slice(0, idx),
      model,
      ...clone.cards.slice(idx + 1)
    ];

    clone.activeCard = model;
  } else {
    model.id = uuid();
    clone.cards = [
      ...clone.cards,
      model
    ];
  }

  return clone;
}

store.registerAction("Save card", saveCard);

export function setActiveCard(state: State, card: Card) {
  return Object.assign({}, state, {
    activeCard: card
  });
}

store.registerAction("Setting active card", setActiveCard);
