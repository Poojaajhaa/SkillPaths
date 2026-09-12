import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user? : {
        userId: number;
        role: string;
      };
    }
  }
}

const normalizeRole = (role?: string) => role?.trim().toUpperCase();

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token required",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };

      // attach decoded to req as needed
      (req as any)._decoded = decoded;

      // continue normal flow

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          role: true,
        },
      });

      if(!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = {
        userId: user.id,
        role: user.role,
      };

      next();
      return;
    } catch {
      return res.status(401).json({
        message: "Invalid or expired token"
      });
    }
  } catch {

    return res.status(401).json({
      message: "Invalid or expired token"
    })
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (normalizeRole(req.user?.role) !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

export const requireSeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const role = normalizeRole(req.user?.role);

  if (role !== "SELLER" && role !== "ADMIN") {
    return res.status(403).json({
      message: "Seller access required",
    });
  }

  next();
};
