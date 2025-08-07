import cors from "cors";
import express, { Request, Response } from "express";
import { db } from "./database";

const app = express();
const PORT: number = parseInt(process.env.PORT || "5001");

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

app.get("/api/cards/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const card = await db.getCard(uuid);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json(card);
});

app.post("/api/cards", async (req: Request, res: Response) => {
  try {
    const card = await db.createCard(req.body);
    res.status(201).json(card);
  } catch (error) {
    res.status(400).json({ error: "Failed to create card" });
  }
});

app.put("/api/cards/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const card = await db.updateCard(uuid, req.body);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json(card);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
