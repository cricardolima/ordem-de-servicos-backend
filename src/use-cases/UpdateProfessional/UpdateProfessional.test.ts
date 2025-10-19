import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { InMemoryProfessionalsRepository } from "@tests/repositories/InMemoryProfessionalsRepository";
import { UpdateProfessionalUseCase } from "./UpdateProfessional.use-case";
import { ICreateProfessionalsRequest, IUpdateProfessionalsRequest, ISession } from "@dtos/models";
import { Professionals } from "@prisma/client";
import crypto from "node:crypto";
import { Role } from "@prisma/client";
import { NotFoundException } from "@exceptions/notFound.exception";

describe("UpdateProfessionalUseCase", () => {
    let testContainer: Container;
    let updateProfessionalUseCase: UpdateProfessionalUseCase;
    let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
    let session: ISession;
    let professional: Professionals;

    beforeAll(async () => {
        testContainer = new ContainerApp().init();
        inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
        testContainer.unbind(TYPES.IProfessionalsRepository);
        testContainer.bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository).toConstantValue(inMemoryProfessionalsRepository);
        updateProfessionalUseCase = testContainer.get<UpdateProfessionalUseCase>(TYPES.IUpdateProfessionalUseCase);

        professional = await inMemoryProfessionalsRepository.create({
            name: "Test Professional",
            registration: "1234567890",
        } as ICreateProfessionalsRequest);

        session = {
            userId: crypto.randomUUID(),
            role: Role.ADMIN,
        } as ISession;
    });

    afterAll(() => {
        inMemoryProfessionalsRepository.clear();
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(UpdateProfessionalUseCase).toBeDefined();
    });

    it("should update a professional", async () => {
        const professionalToUpdate = {
            name: "Test Professional Updated",
            registration: "1234567890",
        } as IUpdateProfessionalsRequest;

        await updateProfessionalUseCase.execute(professional.id, session, professionalToUpdate);

        const updatedProfessional = await inMemoryProfessionalsRepository.findById(professional.id);
        expect(updatedProfessional).toBeDefined();
        expect(updatedProfessional?.name).toBe(professionalToUpdate.name);
        expect(updatedProfessional?.registration).toBe(professionalToUpdate.registration);
    });

    it("should throw an NotFoundException if the professional is not found", async () => {
        const professionalToUpdate = {
            name: "Test Professional Updated",
            registration: "1234567890",
        } as IUpdateProfessionalsRequest;

        await expect(updateProfessionalUseCase.execute(crypto.randomUUID(), session, professionalToUpdate)).rejects.toThrow(NotFoundException);
    });
});