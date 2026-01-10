import { PrismaClient } from "@prisma/client";
import {
  CardCost,
  type Card,
  type CardDB,
  type CreateCardInput,
  type UpdateCardInput,
} from "./types/Card";
import {
  type CardSet,
  type CardSetWithCards,
  type CreateCardSetInput,
  type UpdateCardSetInput,
} from "./types/CardSet";
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

    if (filters.aspect !== undefined && filters.aspect > 0) {
      whereConditions.push(`(identity & ?) = ?`);
      params.push(filters.aspect, filters.aspect);
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

  // CardSet operations
  async createCardSet(
    setData: CreateCardSetInput,
    userId: string
  ): Promise<CardSet> {
    const newSet = await prisma.cardSet.create({
      data: {
        name: setData.name,
        description: setData.description || "",
        creatorId: userId,
      },
    });

    return {
      id: newSet.id,
      name: newSet.name,
      description: newSet.description,
      creatorId: newSet.creatorId,
      createdAt: newSet.createdAt,
      updatedAt: newSet.updatedAt,
    };
  },

  async getCardSet(setId: string): Promise<CardSetWithCards | null> {
    const cardSet = await prisma.cardSet.findUnique({
      where: { id: setId },
      include: {
        cards: {
          select: { cardUuid: true },
          orderBy: { addedAt: "asc" },
        },
      },
    });

    if (!cardSet) return null;

    return {
      id: cardSet.id,
      name: cardSet.name,
      description: cardSet.description,
      creatorId: cardSet.creatorId,
      createdAt: cardSet.createdAt,
      updatedAt: cardSet.updatedAt,
      cardUuids: cardSet.cards.map((c) => c.cardUuid),
    };
  },

  async getUserCardSets(userId: string): Promise<CardSetWithCards[]> {
    const sets = await prisma.cardSet.findMany({
      where: { creatorId: userId },
      include: {
        cards: {
          select: { cardUuid: true },
          orderBy: { addedAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return sets.map((set) => ({
      id: set.id,
      name: set.name,
      description: set.description,
      creatorId: set.creatorId,
      createdAt: set.createdAt,
      updatedAt: set.updatedAt,
      cardUuids: set.cards.map((c) => c.cardUuid),
    }));
  },

  async updateCardSet(
    setId: string,
    setData: UpdateCardSetInput
  ): Promise<CardSet | null> {
    try {
      const updatedSet = await prisma.cardSet.update({
        where: { id: setId },
        data: {
          ...(setData.name && { name: setData.name }),
          ...(setData.description !== undefined && {
            description: setData.description,
          }),
        },
      });

      return {
        id: updatedSet.id,
        name: updatedSet.name,
        description: updatedSet.description,
        creatorId: updatedSet.creatorId,
        createdAt: updatedSet.createdAt,
        updatedAt: updatedSet.updatedAt,
      };
    } catch {
      return null;
    }
  },

  async deleteCardSet(setId: string): Promise<boolean> {
    try {
      await prisma.cardSet.delete({
        where: { id: setId },
      });
      return true;
    } catch {
      return false;
    }
  },

  async addCardToSet(setId: string, cardUuid: string): Promise<boolean> {
    try {
      // Check if card exists
      const card = await prisma.card.findUnique({
        where: { uuid: cardUuid },
      });

      if (!card) return false;

      // Check if card is already in the set
      const existing = await prisma.cardSetMembership.findUnique({
        where: {
          setId_cardUuid: {
            setId,
            cardUuid,
          },
        },
      });

      if (existing) return true; // Already in set, consider it a success

      await prisma.cardSetMembership.create({
        data: {
          setId,
          cardUuid,
        },
      });

      return true;
    } catch {
      return false;
    }
  },

  async removeCardFromSet(setId: string, cardUuid: string): Promise<boolean> {
    try {
      await prisma.cardSetMembership.delete({
        where: {
          setId_cardUuid: {
            setId,
            cardUuid,
          },
        },
      });
      return true;
    } catch {
      return false;
    }
  },

  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  },
};

export default prisma;
