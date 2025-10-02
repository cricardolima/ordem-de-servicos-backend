import request from "supertest";
import { App } from "../../src/app";
import { Express } from "express";
import { Container } from "inversify";
import { InMemoryUserRepositoryV2 } from "../repositories/InMemoryUserRepositoryV2";
import { InMemoryRefreshTokenRepository } from "../repositories/InMemoryRefreshTokenRepository";
import { setupTestContainer } from "../utils/setupTestContainer";
import { User, Role } from "@prisma/client";
import { hash } from "bcrypt";
import crypto from "crypto";

describe("AuthController", () => {
    let app: Express;
    let testContainer: Container;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let testUser: User;

    async function createUser(overrides: Partial<User> = {}) {
        const defaultUser = {
            name: "Test User",
            registration: "admin",
            password: await hash("admin", 10),
            role: Role.ADMIN,
            ...overrides
        };
        return inMemoryUserRepository.createTestUser(defaultUser);
    }

    async function createValidRefreshToken(userId: string) {
        return await inMemoryRefreshTokenRepository.create({
            token: crypto.randomBytes(32).toString("hex"),
            userId: userId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        });
    }

    async function createExpiredRefreshToken(userId: string) {
        return await inMemoryRefreshTokenRepository.create({
            token: crypto.randomBytes(32).toString("hex"),
            userId: userId,
            expiresAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
        });
    }

    beforeAll(async () => {
        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

        testContainer = setupTestContainer( {
            IUserRepository: inMemoryUserRepository,
            IRefreshTokenRepository: inMemoryRefreshTokenRepository
        });

        const appInstance = new App(testContainer);
        (appInstance as any).container = testContainer;
        app = (appInstance as any).server.build();

        testUser = await createUser();
    });

    afterEach(() => {
        // Limpa apenas os refresh tokens após cada teste para evitar conflitos
        inMemoryRefreshTokenRepository.clear();
    });

    afterAll(() => {
        inMemoryUserRepository.clear();
        inMemoryRefreshTokenRepository.clear();
    });

    describe("POST /auth/login", () => {
        it("should return 200 and a token", async () => {
            const response = await request(app).post("/auth/login").send({
                registration: "admin",
                password: "admin"
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("accessToken");
            expect(response.body).toHaveProperty("refreshToken");
        });

        it("should return 401 when password is incorrect", async () => {
            const response = await request(app).post("/auth/login").send({
                registration: "admin",
                password: "incorrect"
            });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Invalid password",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 404 when user not found", async () => {
            const response = await request(app).post("/auth/login").send({
                registration: "nonexistent",
                password: "admin"
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "User not found",
                    type: "not_found_error"
                }
            });
        });

        it("should return 400 when registration is not provided", async () => {
            const response = await request(app).post("/auth/login").send({
                password: "admin"
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: expect.any(String),
                    type: "validation_error",
                    details: [{
                        field: expect.any(String),
                        message: expect.any(String)
                    }]
                }
            });
        });

        it("should return 400 when password is not provided", async () => {
            const response = await request(app).post("/auth/login").send({
                registration: "admin"
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: expect.any(String),
                    type: "validation_error",
                    details: [{
                        field: expect.any(String),
                        message: expect.any(String)
                    }]
                }
            });
        });
    });

    describe("POST /auth/logout", () => {
        it("should return 200 when logging out successfully", async () => {
            const refreshToken = await createValidRefreshToken(testUser.id);
            
            const response = await request(app).post("/auth/logout").send({
                refreshToken: refreshToken.token
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "Logout successful"
            });

            const revokedRefreshToken = await inMemoryRefreshTokenRepository.findByToken(refreshToken.token);
            expect(revokedRefreshToken?.revokedAt).not.toBeNull();
        });

        it("should return 400 when refresh token is not provided", async () => {
            const response = await request(app).post("/auth/logout").send({
                refreshToken: ""
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: expect.any(String),
                    type: "validation_error",
                    details: [{
                        field: expect.any(String),
                        message: expect.any(String)
                    }]
                }
            });
        });

        it("should return 404 when refresh token is not found", async () => {
            const response = await request(app).post("/auth/logout").send({
                refreshToken: "invalid-refresh-token"
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: expect.any(String),
                    type: "not_found_error",
                }
            });
        });
    });
});