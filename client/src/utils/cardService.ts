import type { Card } from "../types/Card";

const API_BASE_URL = "http://localhost:5001/api";

export const cardService = {
  async fetchCard(uuid: string): Promise<Card | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${uuid}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch card:", error);
      return null;
    }
  },

  async saveCard(card: Card): Promise<Card | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to save card:", error);
      return null;
    }
  },

  async updateCard(card: Card): Promise<Card | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/${card.uuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to update card:", error);
      return null;
    }
  },

  async fetchAllCards(): Promise<Array<{
    uuid: string;
    name: string;
    type: string;
  }> | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/cards`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      return null;
    }
  },
};
