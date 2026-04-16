import crypto from 'node:crypto';
import { Role, type User } from '@prisma/client';
import { hash } from 'bcrypt';
import dayjs from 'dayjs';
import type { Express } from 'express';
import type { Container } from 'inversify';
import request from 'supertest';
import { App } from '../../src/app';
import { InMemoryRefreshTokenRepository } from '../repositories/InMemoryRefreshTokenRepository';
import { InMemoryUserRepositoryV2 } from '../repositories/InMemoryUserRepositoryV2';
import { setupTestContainer } from '../utils/setupTestContainer';

describe('AuthController', () => {
  let app: Express;
  let testContainer: Container;
  let inMemoryUserRepository: InMemoryUserRepositoryV2;
  let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
  let testUser: User;
  let consoleErrorSpy: jest.SpyInstance;

  async function createUser(overrides: Partial<User> = {}) {
    const defaultUser = {
      name: 'Test User',
      registration: 'admin',
      password: await hash('admin', 10),
      role: Role.ADMIN,
      ...overrides,
    };
    return inMemoryUserRepository.createTestUser(defaultUser);
  }

  function extractRefreshToken(setCookieHeader: string[] | string | undefined): {
    cookieHeader: string;
    rawToken: string;
  } {
    const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader].filter(Boolean);

    for (const cookie of cookies) {
      if (cookie?.startsWith('refreshToken=')) {
        const [tokenPart] = cookie.split(';');

        if (!tokenPart) {
          break;
        }

        return {
          cookieHeader: cookie,
          rawToken: decodeURIComponent(tokenPart.replace('refreshToken=', '')),
        };
      }
    }

    throw new Error('Refresh token cookie not found');
  }

  async function loginAndGetRefreshToken() {
    const response = await request(app).post('/auth/login').send({
      registration: testUser.registration,
      password: 'admin',
    });

    return {
      ...extractRefreshToken(response.get('set-cookie')),
    };
  }

  async function createValidRefreshToken() {
    return await loginAndGetRefreshToken();
  }

  beforeAll(async () => {
    inMemoryUserRepository = new InMemoryUserRepositoryV2();
    inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

    testContainer = setupTestContainer({
      IUserRepository: inMemoryUserRepository,
      IRefreshTokenRepository: inMemoryRefreshTokenRepository,
    });

    const appInstance = new App(testContainer);
    app = appInstance.build();

    testUser = await createUser();
  });

  beforeEach(() => {
    inMemoryRefreshTokenRepository.clear();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    inMemoryUserRepository.clear();
    inMemoryRefreshTokenRepository.clear();
  });

  describe('POST /auth/login', () => {
    it('should return 200 and a token', async () => {
      const response = await request(app).post('/auth/login').send({
        registration: 'admin',
        password: 'admin',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      const cookiesHeader = response.get('set-cookie');
      const cookies = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader].filter(Boolean);
      expect(cookies.join(';')).toMatch(/refreshToken=/);
      expect(cookies.join(';')).toMatch(/HttpOnly/);
    });

    it('should return 401 when password is incorrect', async () => {
      const response = await request(app).post('/auth/login').send({
        registration: 'admin',
        password: 'incorrect',
      });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Invalid password',
          type: 'unauthorized_error',
        },
      });
    });

    it('should return 404 when user not found', async () => {
      const response = await request(app).post('/auth/login').send({
        registration: 'nonexistent',
        password: 'admin',
      });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'User not found',
          type: 'not_found_error',
        },
      });
    });

    it('should return 400 when registration is not provided', async () => {
      const response = await request(app).post('/auth/login').send({
        password: 'admin',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: expect.any(String),
          type: 'validation_error',
          details: [
            {
              field: expect.any(String),
              message: expect.any(String),
            },
          ],
        },
      });
    });

    it('should return 400 when password is not provided', async () => {
      const response = await request(app).post('/auth/login').send({
        registration: 'admin',
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: expect.any(String),
          type: 'validation_error',
          details: [
            {
              field: expect.any(String),
              message: expect.any(String),
            },
          ],
        },
      });
    });
  });

  describe('POST /auth/logout', () => {
    it('should return 200 when logging out successfully', async () => {
      const { rawToken } = await createValidRefreshToken();
      const response = await request(app)
        .post('/auth/logout')
        .set('Cookie', [`refreshToken=${rawToken}`]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Logout successful',
      });

      const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
      const revokedRefreshToken = await inMemoryRefreshTokenRepository.findByToken(hashed);
      expect(revokedRefreshToken?.revokedAt).not.toBeNull();
    });

    it('should return 400 when refresh token is not provided', async () => {
      const response = await request(app).post('/auth/logout');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: expect.any(String),
          type: 'business_error',
        },
      });
    });

    it('should return 404 when refresh token is not found', async () => {
      const response = await request(app).post('/auth/logout').set('Cookie', ['refreshToken=invalid-refresh-token']);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: expect.any(String),
          type: 'not_found_error',
        },
      });
    });
  });

  describe('POST /auth/refresh-token', () => {
    it('should return 200 with a new access token and refresh cookie', async () => {
      const { cookieHeader } = await loginAndGetRefreshToken();

      const response = await request(app).post('/auth/refresh-token').set('Cookie', [cookieHeader]);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');

      const cookiesHeader = response.get('set-cookie');
      const cookies = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader].filter(Boolean);
      expect(cookies.join(';')).toMatch(/refreshToken=/);
      expect(cookies.join(';')).toMatch(/HttpOnly/);
    });

    it('should return 401 when refresh token is not provided', async () => {
      const response = await request(app).post('/auth/refresh-token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Refresh token not found',
          type: 'unauthorized_error',
        },
      });
    });

    it('should return 401 when refresh token was revoked', async () => {
      const { rawToken, cookieHeader } = await loginAndGetRefreshToken();
      const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
      await inMemoryRefreshTokenRepository.revokeByToken(hashed);

      const response = await request(app).post('/auth/refresh-token').set('Cookie', [cookieHeader]);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Refresh token invalid or revoked',
          type: 'unauthorized_error',
        },
      });
    });

    it('should return 400 when refresh token is expired', async () => {
      const { rawToken, cookieHeader } = await loginAndGetRefreshToken();
      const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
      const refreshToken = await inMemoryRefreshTokenRepository.findByToken(hashed);

      if (!refreshToken) {
        throw new Error('Refresh token not found in repository');
      }

      refreshToken.expiresAt = dayjs().subtract(1, 'day').unix().toString();

      const response = await request(app).post('/auth/refresh-token').set('Cookie', [cookieHeader]);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: {
          message: 'Refresh token expired',
          type: 'business_error',
        },
      });
    });
  });
});
