import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const PORT: number = parseInt(process.env.PORT || "5000");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Set in Stone API Server is running!" });
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "API is working correctly" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
