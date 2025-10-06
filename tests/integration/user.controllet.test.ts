import { Express } from "express";
import { Container } from "inversify";
import { InMemoryUserRepositoryV2 } from "../repositories/InMemoryUserRepositoryV2";
import { setupTestContainer } from "../utils/setupTestContainer";
import { App } from "../../src/app";
import request from "supertest";
import { User, Role } from "@prisma/client";
import { hash } from "bcrypt";
import { InMemoryRefreshTokenRepository } from "../repositories/InMemoryRefreshTokenRepository";

describe("UserController", () => {
    let app: Express;
    let testContainer: Container;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let accessToken: string;

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

    beforeAll(async () => {
        process.env.JWT_SECRET = 'test-access-secret';
        process.env.REFRESH_JWT_SECRET = 'test-refresh-secret';
        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

        testContainer = setupTestContainer({
            IUserRepository: inMemoryUserRepository,
            IRefreshTokenRepository: inMemoryRefreshTokenRepository
        });

        const appInstance = new App(testContainer);
        (appInstance as any).container = testContainer;
        app = (appInstance as any).server.build();

        await createUser();

        // realiza login para obter access token válido
        const loginResponse = await request(app).post("/auth/login").send({
            registration: "admin",
            password: "admin"
        });
        accessToken = loginResponse.body.accessToken;
    });

    afterAll(() => {
        inMemoryUserRepository.clear();
        inMemoryRefreshTokenRepository.clear();
    });

    describe("GET /users", () => {
        it("should return 200 and a list of users", async () => {
            const response = await request(app).get("/users").set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });
    });

    describe("POST /users", () => {
        it("should return 201 and create a user", async () => {
            const response = await request(app).post("/users").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                name: "Test User",
                registration: "teste user",
                password: "password123",
                role: Role.ADMIN,
            });
            expect(response.status).toBe(201);
            expect(response.body).toBeDefined();
        });

        it("should return 401 if the user is not authenticated", async () => {
            const response = await request(app).post("/users").send({
                name: "Test User",
                registration: "teste user",
                password: "password123",
                role: Role.ADMIN,
            });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 400 if the request is invalid", async () => {
            const response = await request(app).post("/users").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                name: "Test User",
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Dados inválidos",
                    type: "validation_error",
                    details: expect.any(Array)
                }
            });
        });

        it("should return 400 if the user already exists", async () => {
            const response = await request(app).post("/users").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                name: "Test User",
                registration: "admin",
                password: "password123",
                role: Role.ADMIN,
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "User already exists",
                    type: "business_error"
                }
            });
        });
    });
});