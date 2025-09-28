import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { BusinessException } from "@exceptions/business.exception";

interface DecodedToken {
    userId: string;
    role: string;
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!jwtSecret) {
        throw new BusinessException('JWT_SECRET not found');
    }

    if (!authHeader?.startsWith('Bearer ')) {
        throw new UnauthorizedException('Token not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new UnauthorizedException('Token not found');
    }

    try {
        const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
        req.session = {...req.session, userId: decoded.userId, role: decoded.role};
        next();
    } catch (error) {
        throw new UnauthorizedException('Invalid token', error as Error);
    }
};