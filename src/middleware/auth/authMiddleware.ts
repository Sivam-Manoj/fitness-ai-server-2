import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Extract token from headers (case-insensitive)
    const token = req.headers["securitykey"] as string;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // If the token is invalid (you may want to compare it against a valid one)
    if (token != (process.env.SECURITY_KEY as string)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid or expired token" });
    }

    // Proceed to the next middleware
    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);

    return res.status(500).json({
      message: "Internal Server Error: Authentication service failed",
    });
  }
};
