import type { Card } from "../types/Card";

const API_BASE_URL = "http://localhost:5001/api";

export interface PaginatedCardsResponse {
  cards: Array<{
    uuid: string;
    name: string;
    type: string;
  }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCards: number;
    cardsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export const cardService = {
  async fetchCard(uuid: string): Promise<Card | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/card/${uuid}`);
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
      const response = await fetch(`${API_BASE_URL}/updatecard/${card.uuid}`, {
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

  async fetchAllCards(
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedCardsResponse | null> {
    console.log(`Fetching all cards - Page: ${page}, Limit: ${limit}`);
    try {
      const response = await fetch(
        `${API_BASE_URL}/cards?page=${page}&limit=${limit}`
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      return null;
    }
  },

  async fetchAllCardUuids(
    page: number = 1,
    limit: number = 2
  ): Promise<{
    uuids: string[];
    pagination: PaginatedCardsResponse["pagination"];
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/cards/uuids?page=${page}&limit=${limit}`
      );
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch card UUIDs: ", error);
      return null;
    }
  },
};
