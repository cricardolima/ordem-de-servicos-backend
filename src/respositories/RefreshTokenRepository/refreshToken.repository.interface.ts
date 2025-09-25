import { RefreshToken } from "@prisma/client";
import { CreateRefreshTokenDto } from "src/dtos/models";

export interface IRefreshTokenRepository {
    create(data: CreateRefreshTokenDto): Promise<RefreshToken>;
}