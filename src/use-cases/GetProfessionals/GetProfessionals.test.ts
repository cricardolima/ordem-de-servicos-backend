import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { IProfessionalsRepository } from "@repositories/ProfessionalsRepository";
import { InMemoryProfessionalsRepository } from "@tests/repositories/InMemoryProfessionalsRepository";
import { GetProfessionalsUseCase } from "./GetProfessionals.use-case";
import { IGetProfessionalsUseCase } from "./GetProfessionals.interface";
import { ICreateProfessionalsRequest } from "@dtos/models";

describe("GetProfessionalsUseCase", () => {
    let testContainer: Container;
    let getProfessionalsUseCase: GetProfessionalsUseCase;
    let inMemoryProfessionalsRepository: InMemoryProfessionalsRepository;

    beforeAll(() => {
        testContainer = new ContainerApp().init();
        inMemoryProfessionalsRepository = new InMemoryProfessionalsRepository();
        testContainer.unbind(TYPES.IProfessionalsRepository);
        testContainer.bind<IProfessionalsRepository>(TYPES.IProfessionalsRepository).toConstantValue(inMemoryProfessionalsRepository);
        getProfessionalsUseCase = testContainer.get<GetProfessionalsUseCase>(TYPES.IGetProfessionalsUseCase);

        inMemoryProfessionalsRepository.create({
            name: "Test Professional",
            registration: "1234567890",
        } as ICreateProfessionalsRequest);
    });

    afterAll(() => {
        testContainer.unbindAll();
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(GetProfessionalsUseCase).toBeDefined();
    });

    it("should get all professionals", async () => {
        const result = await getProfessionalsUseCase.execute();

        expect(result).toBeDefined();
        expect(result.length).toBe(1);
        expect(result[0]?.id).toBeDefined();
    });
});