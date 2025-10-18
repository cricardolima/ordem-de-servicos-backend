import { Express } from "express";
import { Container } from "inversify";
import { InMemoryProfessionalsRepository } from "@tests/repositories/InMemoryProfessionalsRepository";
import { ProfessionalsController } from "@controllers/professionals.controller";
import { InMemoryUserRepositoryV2 } from "@tests/repositories/InMemoryUserRepositoryV2";
import { InMemoryRefreshTokenRepository } from "@tests/repositories/InMemoryRefreshTokenRepository";
import { setupTestContainer } from "../utils/setupTestContainer";
import { App } from "../../src/app";
import request from "supertest";
import createUser from "@tests/utils/createUser";
import { Professionals, User } from "@prisma/client";
import { ICreateProfessionalsRequest } from "@dtos/models";

describe("ProfessionalsController", () => {
    let app: Express;
    let testContainer: Container;
    let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let accessToken: string;
    let consoleErrorSpy: jest.SpyInstance;
    let professionalsController: ProfessionalsController;
    let user: User;
    let professional: Professionals;

    beforeAll(async () => {
        inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
        inMemoryUserRepository = new InMemoryUserRepositoryV2();
        inMemoryRefreshTokenRepository = new InMemoryRefreshTokenRepository();

        testContainer = setupTestContainer({
            IUserRepository: inMemoryUserRepository,
                IProfessionalsRepository: inMemoryProfessionalsRepository,
                IRefreshTokenRepository: inMemoryRefreshTokenRepository
            });

        const appInstance = new App(testContainer);
        (appInstance as any).container = testContainer;
        app = (appInstance as any).server.build();

        user = await createUser(inMemoryUserRepository);

        const loginResponse = await request(app).post("/auth/login").send({
            registration: "admin",
            password: "admin"
        });
        accessToken = loginResponse.body.accessToken;

        professional = await inMemoryProfessionalsRepository.create({
            name: "John Doe",
            registration: "1234567890",
        } as ICreateProfessionalsRequest);
    });

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });

    afterAll(() => {
        testContainer.unbindAll();
        inMemoryUserRepository.clear();
        inMemoryProfessionalsRepository.clear();
        inMemoryRefreshTokenRepository.clear();
        jest.clearAllMocks();
        consoleErrorSpy.mockRestore();
    });

    describe("POST /professionals", () => {
        it("should return 201 and create a professional", async () => {
            const response = await request(app).post("/professionals").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                name: "John Doe",
                registration: "11111111",
            } as ICreateProfessionalsRequest);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it("should return 400 if the professional already exists", async () => {
            const response = await request(app).post("/professionals").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                name: "John Doe",
                registration: professional.registration,    
            } as ICreateProfessionalsRequest);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Professional already exists",
                    type: "business_error"
                }
            });
        });

        
    });
});