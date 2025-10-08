import { Express } from "express";
import { Container } from "inversify";
import { InMemoryServicesTypeRepository } from "../repositories/inMemoryServicesTypeRepository";
import { setupTestContainer } from "../utils/setupTestContainer";
import { App } from "../../src/app";
import request from "supertest";
import { InMemoryUserRepositoryV2 } from "../repositories/InMemoryUserRepositoryV2";
import { InMemoryRefreshTokenRepository } from "../repositories/InMemoryRefreshTokenRepository";
import createUser from "../utils/createUser";

describe("ServicesTypeController", () => {
    let app: Express;
    let testContainer: Container;
    let inMemoryServicesTypeRepository: InMemoryServicesTypeRepository;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let accessToken: string;
    let consoleErrorSpy: jest.SpyInstance;

    beforeAll(async () => {
        inMemoryServicesTypeRepository = new InMemoryServicesTypeRepository();
        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

        testContainer = setupTestContainer({
            IUserRepository: inMemoryUserRepository,
            IServicesTypeRepository: inMemoryServicesTypeRepository,
            IRefreshTokenRepository: inMemoryRefreshTokenRepository
        });

        const appInstance = new App(testContainer);
        (appInstance as any).container = testContainer;
        app = (appInstance as any).server.build();

        await createUser(inMemoryUserRepository);
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
        inMemoryServicesTypeRepository.clear();
        inMemoryRefreshTokenRepository.clear();

        jest.clearAllMocks();
    });

    describe("GET /services-type", () => {
        it("should return 200 and a list of services types", async () => {
            const response = await request(app).get("/services-type").set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it("should return 401 if no access token is provided", async () => {
            const response = await request(app).get("/services-type");

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