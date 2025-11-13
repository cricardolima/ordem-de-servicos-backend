import crypto from 'node:crypto';
import { TYPES } from '@container/types';
import { BusinessException } from '@exceptions/business.exception';
import { NotFoundException } from '@exceptions/notFound.exception';
import { UnauthorizedException } from '@exceptions/unauthorized.exception';
import type { RefreshToken, Role, User } from '@prisma/client';
import type { IRefreshTokenRepository } from '@repositories/RefreshTokenRepository';
import type { IRefreshTokenUseCase } from '@use-cases/RefreshToken/RefreshToken.interface';
import dayjs from 'dayjs';
import type { Response } from 'express';
import { inject, injectable } from 'inversify';
import jwt, { type SignOptions } from 'jsonwebtoken';

@injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  private readonly refreshTokenRepository: IRefreshTokenRepository;
  private readonly refreshJwtSecret: string;
  private readonly accessJwtSecret: string;

  constructor(
    @inject(TYPES.IRefreshTokenRepository)
    refreshTokenRepository: IRefreshTokenRepository,
  ) {
    this.refreshTokenRepository = refreshTokenRepository;
    this.refreshJwtSecret = process.env.REFRESH_JWT_SECRET as string;
    this.accessJwtSecret = process.env.JWT_SECRET as string;
  }

  private async hashToken(token: string): Promise<string> {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public async generateRefreshToken(user: User): Promise<RefreshToken> {
    const expiresAt = dayjs().add(1, 'day').unix();
    const expiresIn: SignOptions['expiresIn'] =
      (process.env.REFRESH_JWT_EXPIRES_IN as SignOptions['expiresIn']) || '1d';

    if (!this.refreshJwtSecret) {
      throw new BusinessException('REFRESH_JWT_SECRET not found');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, this.refreshJwtSecret, { expiresIn });

    const hashedToken = await this.hashToken(token);

    try {
      const refreshToken = await this.refreshTokenRepository.create({
        userId: user.id,
        expiresAt: String(expiresAt),
        token: hashedToken,
      });
      return { ...refreshToken, token };
    } catch (error) {
      throw new BusinessException('Failed to create refresh token', error as Error);
    }
  }

  public async revokeRefreshToken(token: string, res: Response): Promise<void> {
    if (!token) {
      throw new BusinessException('Refresh token not found');
    }
    const hashedToken = await this.hashToken(token);

    const refreshToken = await this.refreshTokenRepository.findByToken(hashedToken);

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }

    await this.refreshTokenRepository.revokeByToken(hashedToken);
    res.clearCookie('refreshToken');
  }

  public async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllByUserId(userId);
  }

  public async refreshToken(token: string, res: Response): Promise<{ accessToken: string }> {
    const accessTokenExpiration: SignOptions['expiresIn'] =
      (process.env.ACCESS_TOKEN_EXPIRATION as SignOptions['expiresIn']) || '5m';

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const hashedToken = await this.hashToken(token);
    const refreshToken = await this.refreshTokenRepository.findByToken(hashedToken);

    if (!refreshToken || refreshToken.revokedAt) {
      throw new UnauthorizedException('Refresh token invalid or revoked');
    }

    const isTokenExpired = dayjs.unix(Number.parseInt(refreshToken.expiresAt, 10)).isBefore(dayjs());

    if (isTokenExpired) {
      throw new BusinessException('Refresh token expired');
    }

    await this.refreshTokenRepository.revokeByToken(hashedToken);

    try {
      const decoded = jwt.verify(token, this.refreshJwtSecret) as {
        userId: string;
        role: Role;
      } & User;
      const newAccessToken = jwt.sign({ userId: decoded.userId, role: decoded.role }, this.accessJwtSecret, {
        expiresIn: accessTokenExpiration,
      });
      const newRefreshToken = await this.generateRefreshToken({
        ...decoded,
        id: decoded.userId,
      });

      res.cookie('refreshToken', newRefreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      });

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new BusinessException('Failed to refresh token', error as Error);
    }
  }
}
