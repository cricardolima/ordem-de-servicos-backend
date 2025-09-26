import { IValidateRefreshTokenResponse } from "@dtos/models";
import { RefreshToken } from "@prisma/client";

export interface IRefreshTokenUseCase {
    validateRefreshToken(refreshToken: string): Promise<IValidateRefreshTokenResponse>;
    generateRefreshToken(userId: string): Promise<RefreshToken>;
    revokeRefreshToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
}