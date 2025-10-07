import { RefreshToken, User } from "@prisma/client";
import { Response } from "express";
export interface IRefreshTokenUseCase {
    generateRefreshToken(user: User): Promise<RefreshToken>;
    revokeRefreshToken(token: string, res: Response): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
    refreshToken(token: string, res: Response): Promise<{ accessToken: string }>;
}