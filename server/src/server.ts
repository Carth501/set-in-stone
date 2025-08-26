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
