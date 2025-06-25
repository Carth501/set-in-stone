import html2canvas from "html2canvas";
import { useState } from "react";
import "./App.css";
import CardDisplay from "./components/CardDisplay";
import CardEditForm from "./components/CardEditForm";
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
    });
    const link = document.createElement("a");
    link.download = `${card.name || "card"}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <h1>Create a Card</h1>
      <CardEditForm card={card} onChange={handleChange} />
      <div style={{ marginTop: 32 }}>
        <h2>Card Preview</h2>
        <div id="card-preview" style={{ backgroundColor: undefined }}>
          <CardDisplay card={card} className={card.type} />
        </div>
        <button style={{ marginTop: 16 }} onClick={handleExport}>
          Export as Image
        </button>
      </div>
      {/* ...other components... */}
    </div>
  );
}

export default App;
