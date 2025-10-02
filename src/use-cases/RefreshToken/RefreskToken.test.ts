import { RefreshTokenUseCase } from "./RefreshToken.use-case";
import { Container } from "inversify";
import { InMemoryRefreshTokenRepository } from "@tests/repositories/InMemoryRefreshTokenRepository";
import { TYPES } from "@container/types";
import { IRefreshTokenRepository } from "@repositories/RefreshTokenRepository";
import { ContainerApp } from "@container/inversify.config";

describe('RefreshTokenUseCase', () => {
    let container: Container;
    let refreshTokenUseCase: RefreshTokenUseCase;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;

    beforeEach(() => {
        container = new ContainerApp().init();
        container.unbind(TYPES.IRefreshTokenRepository);

        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();
        container.bind<IRefreshTokenRepository>(TYPES.IRefreshTokenRepository).toConstantValue(inMemoryRefreshTokenRepository);
        
        refreshTokenUseCase = container.get<RefreshTokenUseCase>(TYPES.IRefreshTokenUseCase);

        inMemoryRefreshTokenRepository.addRefreshToken({
            id: '1',
            token: 'refresh-token-1',
            userId: '1',
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 7),
            createdAt: new Date(),
            revokedAt: null,
        });
    });

    afterEach(() => {
        inMemoryRefreshTokenRepository.clear();
    });

    it('should be defined', () => {
        expect(RefreshTokenUseCase).toBeDefined();
    });

    it('should generate a refresh token', async () => {
        const refreshToken = await refreshTokenUseCase.generateRefreshToken('1');

        expect(refreshToken).toBeDefined();
        expect(refreshToken).not.toBeNull();
        expect(refreshToken).toEqual(expect.objectContaining({
            id: expect.any(String),
            token: expect.any(String),
            userId: '1',
            expiresAt: expect.any(Date),
            createdAt: expect.any(Date),
            revokedAt: null,
        }));
    });

    it('should revoke a refresh token', async () => {
        const refreshToken = await inMemoryRefreshTokenRepository.findByToken('refresh-token-1');
        if (!refreshToken) {
            throw new Error('Refresh token not found');
        }
        await refreshTokenUseCase.revokeRefreshToken(refreshToken.token);
        
        expect(refreshToken).toBeDefined();
        expect(refreshToken).not.toBeNull();
        expect(refreshToken.revokedAt).not.toBeNull();
    });
});
