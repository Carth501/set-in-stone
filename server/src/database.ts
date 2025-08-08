import { PrismaClient } from "@prisma/client";
import {
  type Card,
  type CardDB,
  type CreateCardInput,
  type UpdateCardInput,
} from "./types/Card";

const prisma = new PrismaClient();

// Helper functions to convert between Card and CardDB
const dbToCard = (dbCard: CardDB): Card => ({
  ...dbCard,
  type: dbCard.type as Card["type"],
  aspectList: JSON.parse(dbCard.aspectList),
  tags: JSON.parse(dbCard.tags),
});

const cardToDb = (card: CreateCardInput | UpdateCardInput): CardDB => ({
  uuid: "",
  name: card.name || "",
  aspectList: JSON.stringify(card.aspectList || {}),
  art: card.art || "",
  description: card.description || "",
  objectiveDescription: card.objectiveDescription || "",
  offence: card.offence || 0,
  defence: card.defence || 0,
  regeneration: card.regeneration || 0,
  tags: JSON.stringify(card.tags || []),
  type: card.type ? (card.type as string) : "",
  accessory: null,
});

export const db = {
  async getCard(uuid: string): Promise<Card | null> {
    const card = await prisma.card.findUnique({
      where: { uuid },
    });

    if (!card) return null;
    return dbToCard(card as CardDB);
  },

  async createCard(cardData: CreateCardInput): Promise<Card> {
    const dbData = cardToDb(cardData);
    const newCard = await prisma.card.create({
      data: dbData,
    });

    return dbToCard(newCard as CardDB);
  },

  async updateCard(
    uuid: string,
    cardData: UpdateCardInput
  ): Promise<Card | null> {
    try {
      const updateData = cardToDb(cardData);

      const updatedCard = await prisma.card.update({
        where: { uuid },
        data: updateData,
      });

      return dbToCard(updatedCard as CardDB);
    } catch {
      return null;
    }
  },

  async deleteCard(uuid: string): Promise<boolean> {
    try {
      await prisma.card.delete({
        where: { uuid },
      });
      return true;
    } catch {
      return false;
    }
  },
};

export default prisma;
