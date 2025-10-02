import { RefreshToken } from "@prisma/client";

export interface IRefreshTokenUseCase {
    generateRefreshToken(userId: string): Promise<RefreshToken>;
    revokeRefreshToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
}