import request from "supertest";
import { App } from "../../src/app";
import { Express } from "express";
import { Container } from "inversify";
import { InMemoryUserRepositoryV2 } from "../repositories/InMemoryUserRepositoryV2";
import { InMemoryRefreshTokenRepository } from "../repositories/InMemoryRefreshTokenRepository";
import { setupTestContainer } from "../utils/setupTestContainer";
import { User, Role } from "@prisma/client";
import { hash } from "bcrypt";
import crypto from "node:crypto";
import dayjs from "dayjs";

describe("AuthController", () => {
    let app: Express;
    let testContainer: Container;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let testUser: User;
    let consoleErrorSpy: jest.SpyInstance;

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
        const expiresAt = dayjs().add(1, 'day').unix().toString();
        const rawToken = "refresh-token-1";
        const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
        await inMemoryRefreshTokenRepository.create({
            token: hashed,
            userId: userId,
            expiresAt,
        });
        return { rawToken };
    }

    async function createExpiredRefreshToken(userId: string) {
        const expiresAt = dayjs().subtract(1, 'day').unix().toString();
        const rawToken = "refresh-token-2";
        const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
        await inMemoryRefreshTokenRepository.create({
            token: hashed,
            userId: userId,
            expiresAt,
        });
        return { rawToken };
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

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
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
            const cookiesHeader = response.get('set-cookie');
            const cookies = Array.isArray(cookiesHeader) ? cookiesHeader : [cookiesHeader].filter(Boolean);
            expect(cookies.join(';')).toMatch(/refreshToken=/);
            expect(cookies.join(';')).toMatch(/HttpOnly/);
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
            const { rawToken } = await createValidRefreshToken(testUser.id);
            const response = await request(app).post("/auth/logout").set("Cookie", [`refreshToken=${rawToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "Logout successful"
            });

            const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
            const revokedRefreshToken = await inMemoryRefreshTokenRepository.findByToken(hashed);
            expect(revokedRefreshToken?.revokedAt).not.toBeNull();
        });

        it("should return 400 when refresh token is not provided", async () => {
            const response = await request(app).post("/auth/logout");

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: expect.any(String),
                    type: "business_error",
                }
            });
        });

        it("should return 404 when refresh token is not found", async () => {
            const response = await request(app).post("/auth/logout").set("Cookie", ["refreshToken=invalid-refresh-token"]);

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