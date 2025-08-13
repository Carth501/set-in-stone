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
  accessory: card.accessory || null,
  aspectList: JSON.stringify(card.aspectList || {}),
  aspectMask: card.aspectMask || 0,
  art: card.art || "",
  description: card.description || "",
  objectiveDescription: card.objectiveDescription || "",
  offence: card.offence || 0,
  defence: card.defence || 0,
  regeneration: card.regeneration || 0,
  tags: JSON.stringify(card.tags || []),
  type: card.type ? (card.type as string) : "",
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
    const newUUID = crypto.randomUUID();
    const newCard = await prisma.card.create({
      data: {
        ...dbData,
        uuid: newUUID,
      },
    });

    return dbToCard(newCard as CardDB);
  },

  async updateCard(
    uuid: string,
    cardData: UpdateCardInput
  ): Promise<Card | null> {
    try {
      const updateData = cardToDb(cardData);
      updateData.uuid = uuid;
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

  async getAllCards(
    page: number = 1,
    limit: number = 20
  ): Promise<{ cards: Card[]; total: number }> {
    const offset = (page - 1) * limit;

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.card.count(),
    ]);

    return {
      cards: cards.map((card) => dbToCard(card as CardDB)),
      total,
    };
  },

  async getAllCardUuids(
    page: number = 1,
    limit: number = 20
  ): Promise<{ uuids: string[]; total: number }> {
    const offset = (page - 1) * limit;

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        select: { uuid: true },
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.card.count(),
    ]);

    const uuids = cards
      .map((card) => card.uuid)
      .filter((uuid) => uuid && uuid.trim() !== "");

    return { uuids, total };
  },
};

export default prisma;
