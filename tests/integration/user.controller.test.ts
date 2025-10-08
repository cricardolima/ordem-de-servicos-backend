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
    let user: User;
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

    beforeAll(async () => {
        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

        testContainer = setupTestContainer({
            IUserRepository: inMemoryUserRepository,
            IRefreshTokenRepository: inMemoryRefreshTokenRepository
        });

        const appInstance = new App(testContainer);
        (appInstance as any).container = testContainer;
        app = (appInstance as any).server.build();

        user = await createUser();
        // realiza login para obter access token válido
        const loginResponse = await request(app).post("/auth/login").send({
            registration: "admin",
            password: "admin"
        });
        accessToken = loginResponse.body.accessToken;
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
        jest.clearAllMocks();
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

    describe("DELETE /users/:id", () => {
        it("should return 200 and delete a user", async () => {
            const user = await createUser();
            const response = await request(app).delete(`/users/${user.id}`).set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "User deleted successfully"
            });
        });

        it("should return 401 if the user is not authenticated", async () => {
            const user = await createUser();
            const response = await request(app).delete(`/users/${user.id}`);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 404 if the user does not exist or is already deleted", async () => {
            const response = await request(app).delete(`/users/non-existent-user-id`).set({
                Authorization: `Bearer ${accessToken}`
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
    });

    describe("PATCH /users/:id", () => {
        it("should return 200 and update a user", async () => {
            const user = await createUser();
            const response = await request(app).patch(`/users/${user.id}`).set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                name: "Updated User"
            });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "User updated successfully"
            });
        });

        it("should return 401 if the user is not authenticated", async () => {
            const user = await createUser();
            const response = await request(app).patch(`/users/${user.id}`);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 404 if the user does not exist or is already deleted", async () => {
            const response = await request(app).patch(`/users/non-existent-user-id`).set({
                Authorization: `Bearer ${accessToken}`
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
    });

    describe("GET /users/:id", () => {
        it("should return 200 and get a user by id", async () => {
            const response = await request(app).get(`/users/${user.id}`).set({
                Authorization: `Bearer ${accessToken}`
            });
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body.id).toBe(user.id);
            expect(response.body.name).toBe(user.name);
            expect(response.body.registration).toBe(user.registration);
            expect(response.body.role).toBe(user.role);
            expect(response.body.password).toBeDefined();
            expect(response.body.createdAt).toBeDefined();
            expect(response.body.updatedAt).toBeDefined();
            expect(response.body.deletedAt).toBeNull();
        });

        it("should return 401 if the user is not authenticated", async () => {
            const response = await request(app).get(`/users/${user.id}`);
            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });
    });
});