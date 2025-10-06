import { injectable } from "inversify";
import { IRefreshTokenRepository } from "./refreshToken.repository.interface";
import prisma from "@lib/prisma";
import { RefreshToken } from "@prisma/client";
import { CreateRefreshTokenDto } from "@dtos/models";

@injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    public async create(data: CreateRefreshTokenDto): Promise<RefreshToken> {
        const { token, userId, expiresAt } = data;
        return await prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt,
            },
        });
    }

    public async findByToken(token: string): Promise<RefreshToken | null> {
        const refreshToken = await prisma.refreshToken.findFirst({
            where: {
                token,
            },
        });
        return refreshToken || null;
    }

    public async revokeByToken(token: string): Promise<void> {
        await prisma.refreshToken.update({
            where: { token },
            data: { revokedAt: new Date() },
        });
    }

    public async revokeAllByUserId(userId: string): Promise<void> {
        await prisma.refreshToken.updateMany({
            where: { userId },
            data: { revokedAt: new Date() },
        });
    }
}