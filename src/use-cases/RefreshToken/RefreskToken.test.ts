import crypto from 'node:crypto';
import { ContainerApp } from '@container/inversify.config';
import { TYPES } from '@container/types';
import { Role, type User } from '@prisma/client';
import type { IRefreshTokenRepository } from '@repositories/RefreshTokenRepository';
import type { IUserRepository } from '@repositories/UserRepository';
import { InMemoryRefreshTokenRepository } from '@tests/repositories/InMemoryRefreshTokenRepository';
import { InMemoryUserRepositoryV2 } from '@tests/repositories/InMemoryUserRepositoryV2';
import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import type { Response } from 'express';
import type { Container } from 'inversify';
import jwt from 'jsonwebtoken';
import { RefreshTokenUseCase } from './RefreshToken.use-case';

interface DecodedToken {
  userId: string;
  role: Role;
}

describe('RefreshTokenUseCase', () => {
  let container: Container;
  let refreshTokenUseCase: RefreshTokenUseCase;
  let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
  let user: User;
  let inMemoryUserRepository: InMemoryUserRepositoryV2;

  const response: Partial<Response> = {
    clearCookie: jest.fn(),
    cookie: jest.fn(),
  };

  const hashToken = async (token: string) => {
    return crypto.createHash('sha256').update(token).digest('hex');
  };

  beforeEach(async () => {
    process.env.REFRESH_JWT_SECRET = 'test-secret';
    process.env.JWT_SECRET = 'test-secret-access';
    process.env.ACCESS_TOKEN_EXPIRATION = '5m';
    container = new ContainerApp().init();
    container.unbind(TYPES.IRefreshTokenRepository);
    container.unbind(TYPES.IUserRepository);

    inMemoryUserRepository = new InMemoryUserRepositoryV2();
    container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);

    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();
    container
      .bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository)
      .toConstantValue(inMemoryRefreshTokenRepository);

    refreshTokenUseCase = container.get<RefreshTokenUseCase>(TYPES.IRefreshTokenUseCase);

    user = inMemoryUserRepository.createTestUser({
      name: 'Test User',
      registration: '1',
      password: await hash('password', 10),
      role: Role.USER,
    });
  });

  afterEach(() => {
    inMemoryRefreshTokenRepository.clear();
    inMemoryUserRepository.clear();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(RefreshTokenUseCase).toBeDefined();
  });

  it('should generate a refresh token', async () => {
    const refreshToken = await refreshTokenUseCase.generateRefreshToken(user);

    expect(refreshToken).toBeDefined();
    expect(refreshToken.token).toBeDefined();
    expect(refreshToken.userId).toBe(user.id);
    expect(refreshToken.expiresAt).toBeDefined();

    // Verificar se o token é um JWT válido
    const decoded = jwt.verify(refreshToken.token, 'test-secret') as DecodedToken;
    expect(decoded.userId).toBe(user.id);
    expect(decoded.role).toBe(user.role);
  });

  it('should revoke a refresh token', async () => {
    // Primeiro gerar um refresh token válido
    const refreshToken = await refreshTokenUseCase.generateRefreshToken(user);

    // Agora revogar o token
    await refreshTokenUseCase.revokeRefreshToken(refreshToken.token, response as Response);

    expect(response.clearCookie).toHaveBeenCalledWith('refreshToken');

    // Verificar se o token foi revogado no repositório
    const hashedToken = await hashToken(refreshToken.token);
    const revokedToken = await inMemoryRefreshTokenRepository.findByToken(hashedToken);
    expect(revokedToken?.revokedAt).toBeDefined();
  });

  it('should refresh a token', async () => {
    const generated = await refreshTokenUseCase.generateRefreshToken(user);
    const refreshed = await refreshTokenUseCase.refreshToken(generated.token, response as Response);

    expect(refreshed).toBeDefined();
    expect(refreshed.accessToken).toEqual(expect.any(String));

    // Verificar se o novo access token é válido
    const decoded = jwt.verify(refreshed.accessToken, 'test-secret-access') as DecodedToken;
    expect(decoded.userId).toBe(user.id);
    expect(decoded.role).toBe(user.role);

    // Verificar se um novo refresh token foi definido no cookie
    expect(response.cookie).toHaveBeenCalledWith(
      'refreshToken',
      expect.any(String),
      expect.objectContaining({
        httpOnly: true,
        secure: false, // NODE_ENV não é production
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }),
    );
  });

  it('should throw error when trying to revoke non-existent token', async () => {
    await expect(refreshTokenUseCase.revokeRefreshToken('non-existent-token', response as Response)).rejects.toThrow(
      'Refresh token not found',
    );
  });

  it('should throw error when trying to refresh with invalid token', async () => {
    await expect(refreshTokenUseCase.refreshToken('invalid-token', response as Response)).rejects.toThrow(
      'Refresh token invalid or revoked',
    );
  });

  it('should throw error when trying to refresh with expired token', async () => {
    // Criar um token expirado manualmente
    const expiredToken = jwt.sign(
      { userId: user.id, role: user.role },
      'test-secret',
      { expiresIn: '-1h' }, // Token expirado há 1 hora
    );

    const hashedExpiredToken = await hashToken(expiredToken);
    await inMemoryRefreshTokenRepository.create({
      token: hashedExpiredToken,
      userId: user.id,
      expiresAt: dayjs().subtract(1, 'hour').unix().toString(), // Expirado há 1 hora
    });

    await expect(refreshTokenUseCase.refreshToken(expiredToken, response as Response)).rejects.toThrow(
      'Refresh token expired',
    );
  });
});
