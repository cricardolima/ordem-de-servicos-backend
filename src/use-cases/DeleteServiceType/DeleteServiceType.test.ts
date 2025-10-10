import { Container } from "inversify";
import { ContainerApp } from "@container/inversify.config";
import { TYPES } from "@container/types";
import { InMemoryServicesTypeRepository } from "@tests/repositories/InMemoryServicesTypeRepository";
import { DeleteServiceTypeUseCase } from "./DeleteServiceType.use-case";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { ServicesType } from "@prisma/client";

describe("DeleteServiceTypeUseCase", () => {
    let testContainer: Container;
    let inMemoryServicesTypeRepository: InMemoryServicesTypeRepository;
    let deleteServiceTypeUseCase: DeleteServiceTypeUseCase;
    let servicesType: ServicesType;

    beforeEach(() => {
        testContainer = new ContainerApp().init();
        testContainer.unbind(TYPES.IServicesTypeRepository);

        inMemoryServicesTypeRepository = new InMemoryServicesTypeRepository();
        testContainer.bind<IServicesTypeRepository>(TYPES.IServicesTypeRepository).toConstantValue(inMemoryServicesTypeRepository);
        deleteServiceTypeUseCase = testContainer.get<DeleteServiceTypeUseCase>(TYPES.IDeleteServiceTypeUseCase);

        servicesType = inMemoryServicesTypeRepository.createTestServicesType({
            serviceName: "Test Service",
            serviceCode: "TEST",
        });
    });

    afterEach(() => {
        inMemoryServicesTypeRepository.clear();
    });

    it("should be defined", () => {
        expect(DeleteServiceTypeUseCase).toBeDefined();
    });

    it("should delete a services type", async () => {
        await deleteServiceTypeUseCase.execute(servicesType.id);

        const deletedServicesType = await inMemoryServicesTypeRepository.findById(servicesType.id);
        expect(deletedServicesType).toBeNull();
    });
    
});