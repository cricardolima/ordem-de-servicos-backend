import { injectable, inject } from "inversify";
import { IRefreshTokenUseCase } from "@use-cases/RefreshToken/RefreshToken.interface";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { TYPES } from "@container/types";
import { IValidateRefreshTokenResponse } from "@dtos/models";
import { RefreshToken } from "@prisma/client";
import crypto from "crypto";

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    private readonly refreshTokenRepository: IRefreshTokenRepository;

    constructor(@inject(TYPES.IRefreshTokenRepository) refreshTokenRepository: IRefreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public async generateRefreshToken(userId: string): Promise<RefreshToken> {
        const token = crypto.randomBytes(32).toString("hex");

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 7); // 7 days

        try {
            const refreshToken = await this.refreshTokenRepository.create({
            userId,
            expiresAt,
            token,
            });
            return refreshToken;
        } catch (error) {
            throw new Error("Failed to create refresh token");
        }

    }

    public async validateRefreshToken(token: string): Promise<IValidateRefreshTokenResponse> {
        const refreshToken = await this.refreshTokenRepository.findByToken(token);

        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }

        if (refreshToken.revokedAt) {
            throw new Error("Refresh token revoked");
        }

        if (refreshToken.expiresAt < new Date()) {
            throw new Error("Refresh token expired");
        }

        return {
            userId: refreshToken.userId,
            tokenId: refreshToken.id,
        };
    }

    public async revokeRefreshToken(token: string): Promise<void> {
        await this.refreshTokenRepository.revokeByToken(token);
    }

    public async revokeAllUserTokens(userId: string): Promise<void> {
        await this.refreshTokenRepository.revokeAllByUserId(userId);
    }
}