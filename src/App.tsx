import { useState } from "react";
import "./App.css";
import CardDisplay from "./components/CardDisplay";
import CardEditForm from "./components/CardEditForm";
import type { Card } from "./types/Card.tsx";
import { blankCard } from "./types/Card.tsx";

function App() {
  const [card, setCard] = useState<Card>(blankCard);

  const handleChange = (newCard: Card) => setCard(newCard);

  return (
    <div>
      <h1>Create a Card</h1>
      <CardEditForm card={card} onChange={handleChange} />
      <div style={{ marginTop: 32 }}>
        <h2>Card Preview</h2>
        <CardDisplay card={card} />
      </div>
      {/* ...other components... */}
    </div>
  );
}

export default App;
