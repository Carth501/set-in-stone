import { useEffect, useState } from "react";
import type { Card } from "../types/Card";
import { cardService } from "../utils/cardService";
import CardDisplay from "./CardDisplay";

// Full card display component for grid
function CardGridItem({
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
      <div className="border rounded-lg p-4 h-64 bg-gray-100 animate-pulse"></div>
    );
  }

  if (!card) return null;

  return (
    <div
      className="cursor-pointer w-60 h-90 flex justify-center items-center"
      onClick={() => onClick(card)}
    >
      <div className="scale-60 hover:scale-100 transition origin-center hover:z-20">
        <CardDisplay card={card} />{" "}
      </div>
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
        <CardGridItem key={uuid} uuid={uuid} onClick={onCardSelect} />
      ))}
    </div>
  );
}
