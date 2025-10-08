import { injectable } from "inversify";
import { IServicesTypeRepository } from "../../src/respositories/ServicesTypeRepository/servicesType.repository.interface";
import { ServicesType } from "@prisma/client";
import { BaseInMemoryRepository } from "./BaseInMemoryRepository";

@injectable()
export class InMemoryServicesTypeRepository extends BaseInMemoryRepository<ServicesType> implements IServicesTypeRepository {
    private servicesTypes: ServicesType[] = [];

    public addServicesType(servicesType: ServicesType): void {
        this.servicesTypes.push(servicesType);
    }

    public findAll(): Promise<ServicesType[]> {
        return Promise.resolve(this.servicesTypes);
    }
}