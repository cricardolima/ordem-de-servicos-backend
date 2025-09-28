import { NextFunction, Request, Response } from "express";

interface DecodedToken {
    userId: string;
    role: string;
}

export const hasAccess = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { user } = req.session;
        if (user.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
