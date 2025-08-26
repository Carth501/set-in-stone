import { NextFunction, Request, Response } from "express";
import { sessionService } from "../services/sessionService";
import { userService } from "../services/userService";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = req.cookies?.sessionId;

    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = await sessionService.validateSession(sessionId);

    if (!userId) {
      res.clearCookie("sessionId");
      return res.status(401).json({ error: "Invalid session" });
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      await sessionService.invalidateSession(sessionId);
      res.clearCookie("sessionId");
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
