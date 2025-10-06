import { injectable, inject } from "inversify";
import { IRefreshTokenUseCase } from "@use-cases/RefreshToken/RefreshToken.interface";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { TYPES } from "@container/types";
import { RefreshToken, User, Role } from "@prisma/client";
import { BusinessException } from "@exceptions/business.exception";
import { NotFoundException } from "@exceptions/notFound.exception";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import dayjs from "dayjs";
import { Response } from "express";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";


@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
    private readonly refreshTokenRepository: IRefreshTokenRepository;
    private readonly jwtSecret: string;

    constructor(@inject(TYPES.IRefreshTokenRepository) refreshTokenRepository: IRefreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtSecret = process.env.REFRESH_JWT_SECRET as string;
    }


    private async hashToken(token: string): Promise<string> {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    public async generateRefreshToken(user: User): Promise<RefreshToken> {
        const expiresAt = dayjs().add(1, 'day').unix();
        const expiresIn: SignOptions["expiresIn"] = process.env.REFRESH_JWT_EXPIRES_IN as SignOptions["expiresIn"] || "1d";
        
        if (!this.jwtSecret) {
            throw new BusinessException("REFRESH_JWT_SECRET not found");
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, this.jwtSecret, { expiresIn });

        const hashedToken = await this.hashToken(token);

        try {
            const refreshToken = await this.refreshTokenRepository.create({
            userId: user.id,
            expiresAt: String(expiresAt),
            token: hashedToken,
            });
            return { ...refreshToken, token };
        } catch (error) {
            throw new BusinessException("Failed to create refresh token", error as Error);
        }

    }

    public async revokeRefreshToken(token: string, res: Response): Promise<void> {
        if (!token) {
            throw new BusinessException("Refresh token not found");
        }
        const hashedToken = await this.hashToken(token);
        
        const refreshToken = await this.refreshTokenRepository.findByToken(hashedToken);

        if (!refreshToken) {
            throw new NotFoundException("Refresh token not found");
        }

       await this.refreshTokenRepository.revokeByToken(hashedToken);
       res.clearCookie("refreshToken");
    }

    public async revokeAllUserTokens(userId: string): Promise<void> {
        await this.refreshTokenRepository.revokeAllByUserId(userId);
    }

    public async refreshToken(token: string): Promise<{ accessToken: string }> {
        const accessTokenExpiration: SignOptions["expiresIn"] = process.env.ACCESS_TOKEN_EXPIRATION as SignOptions["expiresIn"] || "5m";
        
        if (!token) {
            throw new UnauthorizedException("Refresh token not found");
        }

        const hashedToken = await this.hashToken(token);
        const refreshToken = await this.refreshTokenRepository.findByToken(hashedToken);

        if (!refreshToken || refreshToken.revokedAt) {
            throw new UnauthorizedException("Refresh token invalid or revoked");
        }

        const isTokenExpired = dayjs(refreshToken.expiresAt).isAfter(dayjs());

        if (isTokenExpired) {
            throw new BusinessException("Refresh token expired");
        }

        try {
            const decoded = jwt.verify(token, this.jwtSecret) as { userId: string, role: Role } & User;

            const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, this.jwtSecret, { expiresIn: accessTokenExpiration });
            await this.generateRefreshToken(decoded);

            return {
                accessToken: newAccessToken,
            };
        }
        catch (error) {
            throw new BusinessException("Failed to refresh token", error as Error);
        }
    }
}