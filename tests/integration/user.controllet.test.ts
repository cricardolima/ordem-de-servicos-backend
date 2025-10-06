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
    let testUser: User;
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

        testUser = await createUser();

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
});