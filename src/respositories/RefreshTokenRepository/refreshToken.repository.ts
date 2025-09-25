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
}