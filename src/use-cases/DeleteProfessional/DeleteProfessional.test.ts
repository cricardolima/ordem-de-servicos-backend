import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { InMemoryProfessionalsRepository } from "@tests/repositories/InMemoryProfessionalsRepository";
import { DeleteProfessionalUseCase } from "./DeleteProfessional.use-case";
import { ICreateProfessionalsRequest, ISession } from "@dtos/models";
import { Professionals } from "@prisma/client";
import crypto from "node:crypto";
import { Role } from "@prisma/client";

describe("DeleteProfessionalUseCase", () => {
    let testContainer: Container;
    let deleteProfessionalUseCase: DeleteProfessionalUseCase;
    let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;
    let session: ISession;
    let professional: Professionals;

    beforeAll(async () => {
        testContainer = new ContainerApp().init();
        inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
        testContainer.unbind(TYPES.IProfessionalsRepository);
        testContainer.bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository).toConstantValue(inMemoryProfessionalsRepository);
        deleteProfessionalUseCase = testContainer.get<DeleteProfessionalUseCase>(TYPES.IDeleteProfessionalUseCase);

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
        expect(DeleteProfessionalUseCase).toBeDefined();
    });

    it("should delete a professional", async () => {
        await deleteProfessionalUseCase.execute(professional.id, session);
        const deletedProfessional = await inMemoryProfessionalsRepository.findById(professional.id);
        
        expect(deletedProfessional).toBeDefined();
        expect(deletedProfessional?.deletedAt).toBeDefined();
        expect(deletedProfessional?.deletedById).toBe(session.userId);
    });

    it("should throw an error if the professional does not exist", async () => {
        await expect(deleteProfessionalUseCase.execute("non-existent-professional-id", session)).rejects.toThrow("Professional not found");
    });
});