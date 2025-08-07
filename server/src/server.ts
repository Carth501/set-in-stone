import cors from "cors";
import express, { Request, Response } from "express";

const app = express();
const PORT: number = parseInt(process.env.PORT || "5000");

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/");
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "API is working correctly" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
