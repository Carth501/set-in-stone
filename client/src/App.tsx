import html2canvas from "html2canvas-pro";
import { useState } from "react";
import type { Card } from "./types/Card";
import { blankCard } from "./types/Card";
import "./App.css";
import CardEditor from "./components/CardEditor.tsx";
import { Button } from "./components/ui/button.tsx";
import { cardService } from "./utils/cardService";

function App() {
  const [card, setCard] = useState<Card>(blankCard);

  const handleChange = (newCard: Card) => setCard(newCard);

  const handleExport = async () => {
    const cardPreview = document.getElementById("card-preview");
    if (!cardPreview) return;
    const canvas = await html2canvas(cardPreview, {
      backgroundColor: null,
      scale: 2,
      ignoreElements: (element) => {
        return element.hasAttribute("data-html2canvas-ignore");
      },
    });
    const link = document.createElement("a");
    link.download = `${card.name || "card"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleLoadCard = async () => {
    const uuid = prompt("Enter card UUID:");
    if (uuid) {
      const fetchedCard = await cardService.fetchCard(uuid);
      if (fetchedCard) {
        setCard(fetchedCard);
      } else {
        alert("Card not found");
      }
    }
  };

  return (
    <div>
      <div id="card-editor" className="bg-gray-900 rounded-3xl p-4">
        <CardEditor
          card={card}
          className={card.type}
          onCardChange={handleChange}
        />
        <div className="mt-2 space-x-2">
          <Button variant="outline" onClick={handleExport}>
            Export as Image
          </Button>
          <Button variant="outline" onClick={handleLoadCard}>
            Load Card
          </Button>
        </div>
      </div>
      {/* ...other components... */}
    </div>
  );
}

export default App;
