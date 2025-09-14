import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const middleware = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers['authorization'] ?? "";

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        
        if(decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}