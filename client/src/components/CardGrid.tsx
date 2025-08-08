import { useEffect, useState } from "react";
import type { Card } from "../types/Card";
import { cardService } from "../utils/cardService";

// Simplified card preview component
function CardPreview({
  uuid,
  onClick,
}: {
  uuid: string;
  onClick: (card: Card) => void;
}) {
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardService.fetchCard(uuid).then((cardData) => {
      setCard(cardData);
      setLoading(false);
    });
  }, [uuid]);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 h-32 bg-gray-100 animate-pulse"></div>
    );
  }

  if (!card) return null;

  return (
    <div
      className="border rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors h-32"
      onClick={() => onClick(card)}
    >
      <h3 className="font-semibold truncate">{card.name || "Unnamed Card"}</h3>
      <p className="text-sm text-gray-600">{card.type}</p>
      <p className="text-xs text-gray-400 truncate">{card.uuid}</p>
    </div>
  );
}

interface CardGridProps {
  onCardSelect: (card: Card) => void;
}

export default function CardGrid({ onCardSelect }: CardGridProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cardService.fetchAllCardUuids?.().then((cardUuids: string[] | null) => {
      if (cardUuids) setUuids(cardUuids);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading cards...</div>;
  }

  if (uuids.length === 0) {
    return <div>There are no cards that match your filters.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {uuids.map((uuid) => (
        <CardPreview key={uuid} uuid={uuid} onClick={onCardSelect} />
      ))}
    </div>
  );
}
