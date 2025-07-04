import html2canvas from "html2canvas-pro";
import { useState } from "react";
import "./App.css";
import CardEditor from "./components/CardEditor.tsx";
import type { Card } from "./types/Card.tsx";
import { blankCard } from "./types/Card.tsx";

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

  return (
    <div>
      <h1>Create a Card</h1>
      <div style={{ marginTop: 32 }}>
        <CardEditor
          card={card}
          className={card.type}
          onCardChange={handleChange}
        />
        <button style={{ marginTop: 16 }} onClick={handleExport}>
          Export as Image
        </button>
      </div>
      {/* ...other components... */}
    </div>
  );
}

export default App;
