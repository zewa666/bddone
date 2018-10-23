import uuid from "uuid/v1";
import { Card } from "./models";

export interface State {
  cards: Card[];
  activeCard: Card;
}

const initialCard = {
  given: "I've started BDDone",
  id: uuid(),
  then: "I should see my first card rendered",
  when: "I'm on the home screen"
};

export const initialState = {
  activeCard: initialCard,
  cards: [
    initialCard,
    {
      given: "I have built BDDone with Aurelia",
      id: uuid(),
      then: "I feel joy",
      when: "I start developing"
    }
  ],
} as State;
