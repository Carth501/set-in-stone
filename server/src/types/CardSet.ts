export type CardSet = {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
  cardUuids?: string[];
};

export type CardSetWithCards = CardSet & {
  cardUuids: string[];
};

export type CreateCardSetInput = {
  name: string;
  description?: string;
};

export type UpdateCardSetInput = {
  name?: string;
  description?: string;
};
