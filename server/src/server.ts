import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { db } from "./database";
import { AuthenticatedRequest, authenticateUser } from "./middleware/auth";
import { sessionService } from "./services/sessionService";
import { userService } from "./services/userService";

const app = express();
const PORT: number = parseInt(process.env.PORT || "5001");

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app URL
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(cookieParser());

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

app.post(
  "/api/cards",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      const card = await db.createCard(req.body, req.user.id);
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ error: "Failed to create card" });
    }
  }
);

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

//#region CardSet routes

// Get all sets for the logged-in user
app.get(
  "/api/sets",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const sets = await db.getUserCardSets(req.user.id);
      res.json(sets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch card sets" });
    }
  }
);

// Get a specific set with its cards
app.get("/api/sets/:setId", async (req: Request, res: Response) => {
  try {
    const { setId } = req.params;
    const cardSet = await db.getCardSet(setId);

    if (!cardSet) {
      return res.status(404).json({ error: "Card set not found" });
    }

    res.json(cardSet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch card set" });
  }
});

// Create a new set
app.post(
  "/api/sets",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { name, description } = req.body;

      if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Set name is required" });
      }

      const newSet = await db.createCardSet({ name, description }, req.user.id);
      res.status(201).json(newSet);
    } catch (error) {
      res.status(400).json({ error: "Failed to create card set" });
    }
  }
);

// Update a set's name or description
app.put(
  "/api/sets/:setId",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { setId } = req.params;
      const { name, description } = req.body;

      // Verify ownership
      const existingSet = await db.getCardSet(setId);
      if (!existingSet) {
        return res.status(404).json({ error: "Card set not found" });
      }

      if (existingSet.creatorId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const updatedSet = await db.updateCardSet(setId, { name, description });

      if (!updatedSet) {
        return res.status(404).json({ error: "Card set not found" });
      }

      res.json(updatedSet);
    } catch (error) {
      res.status(400).json({ error: "Failed to update card set" });
    }
  }
);

// Delete a set
app.delete(
  "/api/sets/:setId",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { setId } = req.params;

      // Verify ownership
      const existingSet = await db.getCardSet(setId);
      if (!existingSet) {
        return res.status(404).json({ error: "Card set not found" });
      }

      if (existingSet.creatorId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const deleted = await db.deleteCardSet(setId);

      if (!deleted) {
        return res.status(404).json({ error: "Card set not found" });
      }

      res.json({ message: "Card set deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete card set" });
    }
  }
);

// Add a card to a set
app.post(
  "/api/sets/:setId/cards/:cardUuid",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { setId, cardUuid } = req.params;

      // Verify ownership
      const existingSet = await db.getCardSet(setId);
      if (!existingSet) {
        return res.status(404).json({ error: "Card set not found" });
      }

      if (existingSet.creatorId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const success = await db.addCardToSet(setId, cardUuid);

      if (!success) {
        return res.status(400).json({ error: "Failed to add card to set" });
      }

      res.json({ message: "Card added to set successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add card to set" });
    }
  }
);

// Remove a card from a set
app.delete(
  "/api/sets/:setId/cards/:cardUuid",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { setId, cardUuid } = req.params;

      // Verify ownership
      const existingSet = await db.getCardSet(setId);
      if (!existingSet) {
        return res.status(404).json({ error: "Card set not found" });
      }

      if (existingSet.creatorId !== req.user?.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const success = await db.removeCardFromSet(setId, cardUuid);

      if (!success) {
        return res
          .status(400)
          .json({ error: "Failed to remove card from set" });
      }

      res.json({ message: "Card removed from set successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove card from set" });
    }
  }
);

//#endregion

//#region Auth routes
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await userService.createUser({ username, email, password });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    res.status(400).json({ error: "Failed to create user" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userService.authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create session and set secure cookie
    const sessionId = await sessionService.createSession(user.id);

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post("/api/auth/logout", async (req: Request, res: Response) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (sessionId) {
      await sessionService.invalidateSession(sessionId);
    }

    res.clearCookie("sessionId");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
});

// Protected route example
app.get(
  "/api/auth/me",
  authenticateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
  }
);
//#endregion

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
