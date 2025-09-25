import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedToken {
    userId: string;
    role: string;
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
        return res.status(500).json({ message: 'JWT_SECRET not found' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token not found' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
        req.session = {...req.session, userId: decoded.userId, role: decoded.role};
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};