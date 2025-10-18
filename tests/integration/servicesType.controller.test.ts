import { Express } from "express";
import { Container } from "inversify";
import { InMemoryServicesTypeRepository } from "@tests/repositories/inMemoryServicesTypeRepository";
import { setupTestContainer } from "../utils/setupTestContainer";
import { App } from "../../src/app";
import request from "supertest";
import { InMemoryUserRepositoryV2 } from "../repositories/InMemoryUserRepositoryV2";
import { InMemoryRefreshTokenRepository } from "../repositories/InMemoryRefreshTokenRepository";
import createUser from "@tests/utils/createUser";
import { ServicesType } from "@prisma/client";

describe("ServicesTypeController", () => {
    let app: Express;
    let testContainer: Container;
    let inMemoryServicesTypeRepository: InMemoryServicesTypeRepository;
    let inMemoryUserRepository: InMemoryUserRepositoryV2;
    let inMemoryRefreshTokenRepository: InMemoryRefreshTokenRepository;
    let accessToken: string;
    let consoleErrorSpy: jest.SpyInstance;
    let servicesType: ServicesType;

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

        const loginResponse = await request(app).post("/auth/login").send({
            registration: "admin",
            password: "admin"
        });
        accessToken = loginResponse.body.accessToken;

        servicesType = inMemoryServicesTypeRepository.createTestServicesType({
            serviceName: "Test Service",
            serviceCode: "TEST03",
        });
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

    describe("POST /services-type", () => {
        it("should return 201 and a new services type", async () => {
            const response = await request(app).post("/services-type").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                serviceName: "Test Service",
                serviceCode: "TEST05",
            });

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it("should return 401 if no access token is provided", async () => {
            const response = await request(app).post("/services-type");

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
            const response = await request(app).post("/services-type").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                serviceName: "Test Service",
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

        it("should return 400 if the services type already exists", async () => {
            const response = await request(app).post("/services-type").set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                serviceName: "Test Service",
                serviceCode: "TEST03",
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Service type already exists",
                    type: "business_error"
                }
            });
        });
    });

    describe("DELETE /services-type/:id", () => {
        it("should return 200 and a message if the services type is deleted", async () => {
            const newServicesType = inMemoryServicesTypeRepository.createTestServicesType({
                serviceName: "Test Service",
                serviceCode: "TEST05",
            });

            const response = await request(app).delete(`/services-type/${newServicesType.id}`).set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "Service type deleted successfully"
            });
        });

        it("should return 401 if no access token is provided", async () => {
            const response = await request(app).delete(`/services-type/${servicesType.id}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 404 if the services type does not exist", async () => {
            const response = await request(app).delete(`/services-type/non-existent-services-type-id`).set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Service type not found",
                    type: "not_found_error"
                }
            });
        });

    });

    describe("PATCH /services-type/:id", () => {
        it("should return 200 and a message if the services type is updated", async () => {
            const response = await request(app).patch(`/services-type/${servicesType.id}`).set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                serviceName: "Test Service Updated",
                serviceCode: "TEST03",
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: "Service type updated successfully"
            });
        });

        it("should return 401 if no access token is provided", async () => {
            const response = await request(app).patch(`/services-type/${servicesType.id}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 404 if the services type does not exist", async () => {
            const response = await request(app).patch(`/services-type/non-existent-services-type-id`).set({
                Authorization: `Bearer ${accessToken}`
            }).send({
                serviceName: "Test Service Updated",
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Service type not found",
                    type: "not_found_error"
                }
            });
        });
    });

    describe("GET /services-type/:id", () => {
        it("should return 200 and a services type", async () => {
            const response = await request(app).get(`/services-type/${servicesType.id}`).set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it("should return 401 if no access token is provided", async () => {
            const response = await request(app).get(`/services-type/${servicesType.id}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Token not found",
                    type: "unauthorized_error"
                }
            });
        });

        it("should return 404 if the services type does not exist", async () => {
            const response = await request(app).get(`/services-type/non-existent-services-type-id`).set({
                Authorization: `Bearer ${accessToken}`
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                error: {
                    message: "Services type not found",
                    type: "not_found_error"
                }
            });
        });
    });
});