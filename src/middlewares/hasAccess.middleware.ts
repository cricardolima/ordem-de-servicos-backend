import { Roles } from "@dtos/models";
import { NextFunction, Request, Response } from "express";
import { ForbiddenException } from "@exceptions/forbidden.exception";

export const hasAccess = (roles: Roles) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!Array.isArray(roles)) {
                roles = [roles];
            }

            const hasRoles = roles.length && roles.some((r) => r === req.session.user.role);
            const isAdmin = req.session.user.role === "ADMIN";

            if (!hasRoles && !isAdmin) {
                throw new ForbiddenException("Forbidden");
            }

            next();
        } catch (error) {
            throw new ForbiddenException("Forbidden", error as Error);
        }
    };
};
