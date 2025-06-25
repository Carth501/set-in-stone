export type Card = {
  name: string;
  cost: CardCost;
  description: string;
  offence: number;
  defence: number;
};

export type CardCost = {
  [key: string]: number;
};

export const blankCard: Card = {
  name: "",
  cost: {},
  description: "",
  offence: 0,
  defence: 0,
};
