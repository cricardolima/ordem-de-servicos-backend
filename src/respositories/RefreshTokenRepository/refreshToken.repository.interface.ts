import type { CreateRefreshTokenDto } from '@dtos/models';
import type { RefreshToken } from '@prisma/client';

export interface IRefreshTokenRepository {
  create(data: CreateRefreshTokenDto): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  revokeByToken(token: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
}
