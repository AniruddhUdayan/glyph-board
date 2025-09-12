import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export const middleware = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers['authorization'] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    if(decoded) {
        req.userId = decoded.userId;
        next();
    }else{
        return res.status(401).json({ message: "Unauthorized" });
    }
}