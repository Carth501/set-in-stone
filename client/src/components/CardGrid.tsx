import { useEffect, useState } from "react";
import type { Card } from "../types/Card";
import { cardService } from "../utils/cardService";

interface CardSummary {
  uuid: string;
  name: string;
  type: string;
}

function CardGridItem({
  cardSummary,
  onClick,
}: {
  cardSummary: CardSummary;
  onClick: () => void;
}) {
  return (
    <div
      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={onClick}
    >
      <h3 className="font-semibold">{cardSummary.name || "Unnamed Card"}</h3>
      <p className="text-sm text-gray-600">{cardSummary.type}</p>
      <p className="text-xs text-gray-400">{cardSummary.uuid}</p>
    </div>
  );
}

interface CardGridProps {
  onCardSelect: (card: Card) => void;
}

export default function CardGrid({ onCardSelect }: CardGridProps) {
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      const cardList = await cardService.fetchAllCards();
      if (cardList) {
        setCards(cardList);
      }
      setLoading(false);
    };

    fetchCards();
  }, []);

  const handleCardClick = async (uuid: string) => {
    const fullCard = await cardService.fetchCard(uuid);
    if (fullCard) {
      onCardSelect(fullCard);
    }
  };

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (cards.length === 0) {
    return <div>There are no cards that match your filters.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {cards.map((cardSummary) => (
        <CardGridItem
          key={cardSummary.uuid}
          cardSummary={cardSummary}
          onClick={() => handleCardClick(cardSummary.uuid)}
        />
      ))}
    </div>
  );
}
