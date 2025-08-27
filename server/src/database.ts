import { PrismaClient } from "@prisma/client";
import {
  CardCost,
  type Card,
  type CardDB,
  type CreateCardInput,
  type UpdateCardInput,
} from "./types/Card";
import { ASPECTS } from "./types/aspects";

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
  identity: generateIdentity(card.aspectMask || 0, card.aspectList || {}),
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

export const generateIdentity = (
  aspectMask: number,
  aspectList: CardCost
): number => {
  if (aspectMask !== null && aspectMask !== undefined && aspectMask !== 0) {
    return aspectMask;
  } else {
    let value = 0;
    for (let i = 0; i < ASPECTS.length; i++) {
      if (ASPECTS[i] !== "FUNDAMENTAL" && aspectList[ASPECTS[i]] > 0) {
        value += 1 << i;
      }
    }
    return value;
  }
};

export const db = {
  async getCard(uuid: string): Promise<Card | null> {
    const card = await prisma.card.findUnique({
      where: { uuid },
    });

    if (!card) return null;
    return dbToCard(card as CardDB);
  },

  async createCard(cardData: CreateCardInput, userId: string): Promise<Card> {
    const dbData = cardToDb(cardData);
    const newUUID = crypto.randomUUID();
    const newCard = await prisma.card.create({
      data: {
        ...dbData,
        uuid: newUUID,
        creatorId: userId,
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
        orderBy: { createdAt: "asc" },
      }),
      prisma.card.count(),
    ]);

    const uuids = cards
      .map((card) => card.uuid)
      .filter((uuid) => uuid && uuid.trim() !== "");

    return { uuids, total };
  },

  async searchCardUuids(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<{ uuids: string[]; total: number }> {
    const offset = (page - 1) * limit;

    const where: any = {};

    if (filters.name && filters.name.trim() !== "") {
      const nameFilter = filters.name.trim();
      where.name = { contains: nameFilter };
    }

    if (filters.accessory && filters.accessory !== "any") {
      where.accessory = filters.accessory.toUpperCase();
    }

    if (filters.type && filters.type !== "any") {
      where.type = filters.type.toUpperCase();
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagConditions = filters.tags.map((tag: string) => ({
        tags: { contains: `"${tag.toLowerCase()}"` },
      }));

      if (tagConditions.length === 1) {
        where.tags = tagConditions[0].tags;
      } else {
        where.AND = tagConditions;
      }
    }

    if (filters.offenceMin !== undefined || filters.offenceMax !== undefined) {
      where.offence = {};
      if (filters.offenceMin !== undefined)
        where.offence.gte = filters.offenceMin;
      if (filters.offenceMax !== undefined)
        where.offence.lte = filters.offenceMax;
    }

    if (filters.defenceMin !== undefined || filters.defenceMax !== undefined) {
      where.defence = {};
      if (filters.defenceMin !== undefined)
        where.defence.gte = filters.defenceMin;
      if (filters.defenceMax !== undefined)
        where.defence.lte = filters.defenceMax;
    }

    if (
      filters.regenerationMin !== undefined ||
      filters.regenerationMax !== undefined
    ) {
      where.regeneration = {};
      if (filters.regenerationMin !== undefined)
        where.regeneration.gte = filters.regenerationMin;
      if (filters.regenerationMax !== undefined)
        where.regeneration.lte = filters.regenerationMax;
    }

    if (filters.aspect !== undefined && filters.aspect > 0) {
      where.identity = { equals: filters.aspect };
    }

    if (filters.hasArt !== undefined) {
      if (filters.hasArt) {
        where.art = { not: "" };
      } else {
        where.art = "";
      }
    }

    try {
      const [cards, total] = await Promise.all([
        prisma.card.findMany({
          select: { uuid: true, name: true },
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.card.count({ where }),
      ]);

      const uuids = cards
        .map((card) => card.uuid)
        .filter((uuid) => uuid && uuid.trim() !== "");

      return { uuids, total };
    } catch (error) {
      console.error("Prisma query failed:", error);
      throw error;
    }
  },
};

export default prisma;
