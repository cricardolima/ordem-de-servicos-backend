import { inject, injectable } from "inversify";
import { IGenerateRefreshTokenUseCase } from "./GenerateRefreshToken.interface";
import { TYPES } from "@container/types";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import crypto from "crypto";
import { RefreshToken } from "@prisma/client";

@injectable()
export class GenerateRefreshTokenUseCase implements IGenerateRefreshTokenUseCase {
    private readonly refreshTokenRepository: IRefreshTokenRepository;

    constructor(@inject(TYPES.IRefreshTokenRepository) refreshTokenRepository: IRefreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public async execute(userId: string): Promise<RefreshToken> {
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
}