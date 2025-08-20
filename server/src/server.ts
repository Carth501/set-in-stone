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

app.get("/api/card/:uuid", async (req: Request, res: Response) => {
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

app.put("/api/updatecard/:uuid", async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const card = await db.updateCard(uuid, req.body);

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }

  res.json(card);
});

app.get("/api/cards", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { cards, total } = await db.getAllCards(page, limit);
    const cardList = cards.map((card) => ({
      uuid: card.uuid,
      name: card.name,
      type: card.type,
    }));

    res.json({
      cards: cardList,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCards: total,
        cardsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cards" });
  }
});

app.get("/api/cards/uuids", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const { uuids, total } = await db.getAllCardUuids(page, limit);

    res.json({
      uuids,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCards: total,
        cardsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch card UUIDs" });
  }
});

app.post("/api/cards/uuids/search", async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const { uuids, total } = await db.searchCardUuids(page, limit, filters);
    console.log("Result uuids: ", uuids, " total: ", total);
    res.json({
      uuids,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCards: total,
        cardsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to search card UUIDs" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
