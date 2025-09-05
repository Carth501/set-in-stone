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

    const whereConditions: string[] = [];
    const params: any[] = [];

    if (filters.name && filters.name.trim() !== "") {
      whereConditions.push(`name LIKE ?`);
      params.push(`%${filters.name.trim()}%`);
    }

    if (filters.accessory && filters.accessory !== "any") {
      whereConditions.push(`accessory = ?`);
      params.push(filters.accessory.toUpperCase());
    }

    if (filters.type && filters.type !== "any") {
      whereConditions.push(`type = ?`);
      params.push(filters.type.toUpperCase());
    }

    if (filters.tags && filters.tags.length > 0) {
      for (const tag of filters.tags) {
        whereConditions.push(`tags LIKE ?`);
        params.push(`%"${tag.toLowerCase()}"%`);
      }
    }

    if (filters.offenceMin !== undefined) {
      whereConditions.push(`offence >= ?`);
      params.push(filters.offenceMin);
    }

    if (filters.offenceMax !== undefined) {
      whereConditions.push(`offence <= ?`);
      params.push(filters.offenceMax);
    }

    if (filters.defenceMin !== undefined) {
      whereConditions.push(`defence >= ?`);
      params.push(filters.defenceMin);
    }

    if (filters.defenceMax !== undefined) {
      whereConditions.push(`defence <= ?`);
      params.push(filters.defenceMax);
    }

    if (filters.regenerationMin !== undefined) {
      whereConditions.push(`regeneration >= ?`);
      params.push(filters.regenerationMin);
    }

    if (filters.regenerationMax !== undefined) {
      whereConditions.push(`regeneration <= ?`);
      params.push(filters.regenerationMax);
    }

    if (filters.aspectMask !== undefined && filters.aspectMask > 0) {
      whereConditions.push(`(identity & ?) = ?`);
      params.push(filters.aspectMask, filters.aspectMask);
    }

    if (filters.hasArt !== undefined) {
      if (filters.hasArt) {
        whereConditions.push(`art != ""`);
      } else {
        whereConditions.push(`art = ""`);
      }
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    try {
      const cardsQuery = `
        SELECT uuid, name FROM Card 
        ${whereClause}
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `;

      const countQuery = `
        SELECT COUNT(*) as total FROM Card 
        ${whereClause}
      `;

      const cards = (await prisma.$queryRawUnsafe(
        cardsQuery,
        ...params,
        limit,
        offset
      )) as any[];

      const countResult = (await prisma.$queryRawUnsafe(
        countQuery,
        ...params
      )) as any[];

      const total = Number(countResult[0].total);
      const uuids = cards
        .map((card) => card.uuid)
        .filter((uuid) => uuid && uuid.trim() !== "");

      return { uuids, total };
    } catch (error) {
      console.error("Raw SQL query failed:", error);
      throw error;
    }
  },
};

export default prisma;
