import { InMemoryRefreshTokenRepository } from "./InMemoryRefreshTokenRepository";
import { InMemoryUserRepositoryV2 } from "./InMemoryUserRepositoryV2";
import { User, Role } from "@prisma/client";
import { CreateRefreshTokenDto } from "../../src/dtos/models";

describe('Exemplos de Uso - Repositórios In-Memory', () => {
    let refreshTokenRepository: InMemoryRefreshTokenRepository;
    let userRepositoryV2: InMemoryUserRepositoryV2;

    beforeEach(() => {
        refreshTokenRepository = new InMemoryRefreshTokenRepository();
        userRepositoryV2 = new InMemoryUserRepositoryV2();
    });

    afterEach(() => {
        refreshTokenRepository.clear();
        userRepositoryV2.clear();
    });

    describe('InMemoryUserRepository - Exemplo Básico', () => {
        it('deve permitir adicionar e buscar usuários', async () => {
            // Arrange - Criar dados de teste
            const testUser: User = {
                id: '1',
                name: 'João Silva',
                password: 'hashedPassword123',
                registration: '1234567890',
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
                role: Role.USER
            };

            // Act - Adicionar usuário e buscar
            userRepositoryV2.addItem(testUser);
            const foundUser = await userRepositoryV2.findByRegistration('1234567890');

            // Assert
            expect(foundUser).toEqual(testUser);
            expect(foundUser.name).toBe('João Silva');
        });

        it('deve lançar erro quando usuário não é encontrado', async () => {
            // Act & Assert
            await expect(
                userRepositoryV2.findByRegistration('inexistente')
            ).rejects.toThrow('User with registration inexistente not found');
        });

        it('deve permitir adicionar múltiplos usuários', async () => {
            // Arrange
            const users: User[] = [
                {
                    id: '1',
                    name: 'Usuário 1',
                    password: 'hash1',
                    registration: '1111111111',
                    createdAt: new Date(),
                    updatedAt: null,
                    deletedAt: null,
                    role: Role.USER
                },
                {
                    id: '2',
                    name: 'Usuário 2',
                    password: 'hash2',
                    registration: '2222222222',
                    createdAt: new Date(),
                    updatedAt: null,
                    deletedAt: null,
                    role: Role.ADMIN
                }
            ];

            // Act
            userRepositoryV2.addItems(users);
            const count = await userRepositoryV2.count();

            // Assert
            expect(count).toBe(2);
            expect(await userRepositoryV2.findByRole(Role.ADMIN)).toHaveLength(1);
        });
    });

    describe('InMemoryRefreshTokenRepository - Exemplo Básico', () => {
        it('deve permitir criar e buscar refresh tokens', async () => {
            // Arrange
            const createDto: CreateRefreshTokenDto = {
                token: 'refresh-token-123',
                userId: 'user-123',
                expiresAt: new Date(Date.now() + 3600000) // 1 hora
            };

            // Act
            const createdToken = await refreshTokenRepository.create(createDto);
            const foundToken = await refreshTokenRepository.findByToken('refresh-token-123');

            // Assert
            expect(createdToken.token).toBe('refresh-token-123');
            expect(foundToken).toEqual(createdToken);
        });

        it('deve permitir revogar tokens', async () => {
            // Arrange
            const createDto: CreateRefreshTokenDto = {
                token: 'token-to-revoke',
                userId: 'user-123',
                expiresAt: new Date(Date.now() + 3600000)
            };

            // Act
            await refreshTokenRepository.create(createDto);
            await refreshTokenRepository.revokeByToken('token-to-revoke');
            const token = await refreshTokenRepository.findByToken('token-to-revoke');

            // Assert
            expect(token.revokedAt).not.toBeNull();
        });
    });

    describe('InMemoryUserRepositoryV2 - Exemplo com Classe Base', () => {
        it('deve criar usuários de teste facilmente', () => {
            // Act
            const testUser = userRepositoryV2.createTestUser({
                name: 'Usuário de Teste',
                role: Role.ADMIN
            });

            // Assert
            expect(testUser.name).toBe('Usuário de Teste');
            expect(testUser.role).toBe(Role.ADMIN);
            expect(testUser.id).toBeDefined();
        });

        it('deve criar múltiplos usuários de teste', () => {
            // Act
            const users = userRepositoryV2.createTestUsers(3, {
                role: Role.USER
            });

            // Assert
            expect(users).toHaveLength(3);
            expect(users.every(user => user.role === Role.USER)).toBe(true);
            expect(users[0].registration).toBe('12345678900');
            expect(users[1].registration).toBe('12345678901');
            expect(users[2].registration).toBe('12345678902');
        });

        it('deve permitir soft delete e restore', async () => {
            // Arrange
            const testUser = userRepositoryV2.createTestUser();

            // Act - Soft delete
            const deleteResult = await userRepositoryV2.softDelete(testUser.id);
            const deletedUsers = await userRepositoryV2.findDeletedUsers();

            // Assert - Delete
            expect(deleteResult).toBe(true);
            expect(deletedUsers).toHaveLength(1);

            // Act - Restore
            const restoreResult = await userRepositoryV2.restore(testUser.id);
            const activeUsers = await userRepositoryV2.findActiveUsers();

            // Assert - Restore
            expect(restoreResult).toBe(true);
            expect(activeUsers).toHaveLength(1);
        });
    });

    describe('Exemplo de Setup Completo para Teste de Use Case', () => {
        it('deve demonstrar setup completo para teste de login', async () => {
            // Arrange - Setup completo do cenário de teste
            const testUser: User = {
                id: 'user-123',
                name: 'Usuário Teste',
                password: '$2b$10$hashedPassword', // Senha já hasheada
                registration: '1234567890',
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
                role: Role.USER
            };

            const refreshTokenDto: CreateRefreshTokenDto = {
                token: 'existing-refresh-token',
                userId: 'user-123',
                expiresAt: new Date(Date.now() + 3600000)
            };

            // Act - Setup dos dados
            userRepositoryV2.addItem(testUser);
            await refreshTokenRepository.create(refreshTokenDto);

            // Act - Simular busca do usuário (como faria o use case)
            const foundUser = await userRepositoryV2.findByRegistration('1234567890');
            const existingToken = await refreshTokenRepository.findByToken('existing-refresh-token');

            // Assert
            expect(foundUser).toEqual(testUser);
            expect(existingToken.userId).toBe('user-123');
            expect(await userRepositoryV2.count()).toBe(1);
            expect(await refreshTokenRepository.count()).toBe(1);
        });
    });
});
