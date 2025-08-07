import { PrismaClient } from "@prisma/client";
import type { Card } from "../../shared/types/Card";

const prisma = new PrismaClient();

export const db = {
  async getCard(uuid: string): Promise<Card | null> {
    const card = await prisma.card.findUnique({
      where: { uuid },
    });
    return card as Card | null;
  },

  async createCard(card: Omit<Card, "uuid">): Promise<Card> {
    const newCard = await prisma.card.create({
      data: card,
    });
    return newCard as Card;
  },

  async updateCard(uuid: string, card: Partial<Card>): Promise<Card | null> {
    try {
      const updatedCard = await prisma.card.update({
        where: { uuid },
        data: card,
      });
      return updatedCard as Card;
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
