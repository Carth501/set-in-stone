import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const PORT: number = parseInt(process.env.PORT || "5001");

// Mock card data (replace with database later)
const mockCards: any[] = [
  {
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    accessory: null,
    type: "CREATURE",
    name: "Stone Guardian",
    aspectList: { earth: 3, neutral: 1 },
    art: "stone-guardian.jpg",
    description: "A mighty guardian made of living stone.",
    objectiveDescription: "",
    offence: 4,
    defence: 6,
    regeneration: 1,
    tags: ["Guardian", "Elemental"],
  },
];

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/");
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "API is working correctly" });
});

app.get("/api/cards/:uuid", (req: Request, res: Response) => {
  const { uuid } = req.params;
  const card = mockCards.find((c) => c.uuid === uuid);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json(card);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
