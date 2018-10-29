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

export function deleteCard(state: State, id: string) {
  const idx = state.cards.findIndex((c) => c.id === id);

  return {
    ...state,
    cards: [
      ...state.cards.slice(0, idx),
      ...state.cards.slice(idx + 1),
    ]
  };
}
store.registerAction("Delete card", deleteCard);

export function loginUser(
  state: State,
  authResult: auth0.Auth0DecodedHash,
  user: auth0.Auth0UserProfile
) {
  const expiresAt = JSON.stringify(
    authResult.expiresIn * 1000 + new Date().getTime()
  );
  localStorage.setItem("access_token", authResult.accessToken);
  localStorage.setItem("id_token", authResult.idToken);
  localStorage.setItem("expires_at", expiresAt);

  return Object.assign({}, state, {
    user
  });
}
store.registerAction("Login user", loginUser);

export function logoutUser(state: State) {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("expires_at");

  return Object.assign({}, state, {
    user: undefined
  });
}

store.registerAction("Logout user", logoutUser);
