import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { InMemoryServicesTypeRepository } from "@tests/repositories/inMemoryServicesTypeRepository";
import { UpdateServicesTypeUseCase } from "./UpdateServicesType.use-case";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { IUpdateServicesTypeRequest } from "@dtos/models";
import { ServicesType } from "@prisma/client";
import { NotFoundException } from "@exceptions/notFound.exception";

describe("UpdateServicesTypeUseCase", () => {
    let testContainer: Container;
    let updateServicesTypeUseCase: UpdateServicesTypeUseCase;
    let inMemoryServicesTypeRepository: InMemoryServicesTypeRepository;
    let servicesType: ServicesType;
    beforeEach(() => {
        testContainer = new ContainerApp().init();
        testContainer.unbind(TYPES.IServicesTypeRepository);

        inMemoryServicesTypeRepository = new InMemoryServicesTypeRepository();
        testContainer.bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository).toConstantValue(inMemoryServicesTypeRepository);
        updateServicesTypeUseCase = testContainer.get<UpdateServicesTypeUseCase>(TYPES.IUpdateServicesTypeUseCase);

        servicesType = inMemoryServicesTypeRepository.createTestServicesType({
            serviceName: "Test Service",
            serviceCode: "TEST",
        });
    });

    afterEach(() => {
        inMemoryServicesTypeRepository.clear();
        jest.clearAllMocks();
    });

    it("should be defined", () => {
        expect(UpdateServicesTypeUseCase).toBeDefined();
    });

    it("should update a services type", async () => {
        const servicesTypeToUpdate: IUpdateServicesTypeRequest = {
            serviceName: "Test Service Updated",
            serviceCode: "TEST02",
        };

        await updateServicesTypeUseCase.execute(servicesType.id, servicesTypeToUpdate);

        const updatedServicesType = await inMemoryServicesTypeRepository.findById(servicesType.id!);
        expect(updatedServicesType).toBeDefined();
        expect(updatedServicesType?.serviceName).toBe(servicesTypeToUpdate.serviceName);
        expect(updatedServicesType?.serviceCode).toBe(servicesTypeToUpdate.serviceCode);
    });

    it("should throw an error if the services type is not found", async () => {
        const servicesTypeToUpdate: IUpdateServicesTypeRequest = {
            serviceName: "Test Service Updated",
            serviceCode: "TEST02",
        };

        await expect(updateServicesTypeUseCase.execute("123", servicesTypeToUpdate)).rejects.toThrow(NotFoundException);
    });
    
});