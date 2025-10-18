import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { InMemoryProfessionalsRepository } from "@tests/repositories/InMemoryProfessionalsRepository";
import { CreateProfessionalsUseCase } from "./CreateProfessionals.use-case";
import { ICreateProfessionalsRequest, ISession } from "@dtos/models";
import { Role } from "@prisma/client";
import crypto from "node:crypto";
import { BusinessException } from "@exceptions/business.exception";

describe("CreateProfessionalsUseCase", () => {
    let testContainer: Container;
    let createProfessionalsUseCase: CreateProfessionalsUseCase;
    let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
    let session: ISession;

    beforeEach(() => {
        testContainer = new ContainerApp().init();
        inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
        testContainer.unbind(TYPES.IProfessionalsRepository);
        testContainer.bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository).toConstantValue(inMemoryProfessionalsRepository);
        createProfessionalsUseCase = testContainer.get<CreateProfessionalsUseCase>(TYPES.ICreateProfessionalsUseCase);

        session = {
            userId: crypto.randomUUID(),
            role: Role.ADMIN,
        } as ISession;
    });

    afterEach(() => {
        testContainer.unbindAll();
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(CreateProfessionalsUseCase).toBeDefined();
    });

    it("should create a professionals", async () => {
        const professional = {
            name: "John Doe",
            registration: "1234567890",
            createdById: session.userId,
        } as ICreateProfessionalsRequest;

        const result = await createProfessionalsUseCase.execute(session, professional);

        expect(result).toBeDefined();
        expect(result.name).toBe(professional.name);
        expect(result.registration).toBe(professional.registration);
        expect(result.createdById).toBe(session.userId);
    });

    it("should throw a BusinessException if the professionals already exists", async () => {
        const professional = {
            name: "John Doe",
            registration: "1234567890",
            createdById: session.userId,
        } as ICreateProfessionalsRequest;

        await createProfessionalsUseCase.execute(session, professional);

        await expect(createProfessionalsUseCase.execute(session, professional)).rejects.toThrow(BusinessException);
    });
});