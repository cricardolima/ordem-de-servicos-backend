import { RefreshToken } from "@prisma/client";
import { CreateRefreshTokenDto } from "src/dtos/models";

export interface IRefreshTokenRepository {
    create(data: CreateRefreshTokenDto): Promise<RefreshToken>;
    findByToken(token: string): Promise<RefreshToken | null>;
    revokeByToken(token: string): Promise<void>;
    revokeAllByUserId(userId: string): Promise<void>;
}