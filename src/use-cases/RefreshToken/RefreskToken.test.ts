import { RefreshTokenUseCase } from "./RefreshToken.use-case";
import { Container } from "inversify";
import { InMemoryRefreshTokenRepository } from "@tests/repositories/InMemoryRefreshTokenRepository";
import { TYPES } from "@container/types";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { ContainerApp } from "@container/inversify.config";
import dayjs from "dayjs";
import { User } from "@prisma/client";
import { hash } from "bcrypt";
import { InMemoryUserRepositoryV2 } from "@tests/repositories/InMemoryUserRepositoryV2";
import { IUserRepository } from "@repositories/UserRepository";
import { Response } from "express";
import crypto from "crypto";

describe('RefreshTokenUseCase', () => {
    let container: Container;
    let refreshTokenUseCase: RefreshTokenUseCase;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let user: User;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;

    const response: Partial<Response> = {
        clearCookie: jest.fn(),
    };

    const hashToken = async (token: string) => {
        return crypto.createHash('sha256').update(token).digest('hex');
    };

    beforeEach(async () => {
        process.env.REFRESH_JWT_SECRET = 'test-secret';
        container = new ContainerApp().init();
        container.unbind(TYPES.IRefreshTokenRepository);
        container.unbind(TYPES.IUserRepository);

        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(inMemoryUserRepository);

        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();
        container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).toConstantValue(inMemoryRefreshTokenRepository);
        
        refreshTokenUseCase = container.get<RefreshTokenUseCase>(TYPES.IRefreshTokenUseCase);

        await inMemoryRefreshTokenRepository.create({
            token: await hashToken('refresh-token-1'),
            userId: '1',
            expiresAt: dayjs().add(1, 'day').unix().toString(),
        });

        user = inMemoryUserRepository.createTestUser({
            name: 'Test User',
            registration: '1',
            password: await hash('password', 10),
        });
    });

    afterEach(() => {
        inMemoryRefreshTokenRepository.clear();
        inMemoryUserRepository.clear();
    });

    it('should be defined', () => {
        expect(RefreshTokenUseCase).toBeDefined();
    });

    it('should generate a refresh token', async () => {
        const refreshToken = await refreshTokenUseCase.generateRefreshToken(user);

        expect(refreshToken).toBeDefined();
        expect(refreshToken).not.toBeNull();
    });

    it('should revoke a refresh token', async () => {
        await refreshTokenUseCase.revokeRefreshToken('refresh-token-1', response as Response);
        
        expect(response.clearCookie).toHaveBeenCalledWith("refreshToken");
    });

    it('should refresh a token', async () => {
        const generated = await refreshTokenUseCase.generateRefreshToken(user);
        const refreshed = await refreshTokenUseCase.refreshToken(generated.token);

        expect(refreshed).toBeDefined();
        expect(refreshed.accessToken).toEqual(expect.any(String));
    });
});
