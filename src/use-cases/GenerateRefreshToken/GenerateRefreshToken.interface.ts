import { RefreshToken } from "@prisma/client";

export interface IGenerateRefreshTokenUseCase {
    execute(userId: string): Promise<RefreshToken>;
}