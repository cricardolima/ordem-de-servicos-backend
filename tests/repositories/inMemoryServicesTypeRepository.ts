import { injectable } from "inversify";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { ServicesType } from "@prisma/client";
import { BaseInMemoryRepository } from "./BaseInMemoryRepository";
import { ICreateServicesTypeRequest, IUpdateServicesTypeRequest } from "@dtos/models";

@injectable()
export class InMemoryServicesTypeRepository extends BaseInMemoryRepository<ServicesType> implements IServicesTypeRepository {
    private servicesTypes: ServicesType[] = [];

    public addServicesType(servicesType: ServicesType): void {
        this.servicesTypes.push(servicesType);
    }

    public findAll(): Promise<ServicesType[]> {
        return Promise.resolve(this.servicesTypes);
    }

    public create(servicesType: ICreateServicesTypeRequest): Promise<ServicesType> {
        const newServicesType = { ...servicesType, id: this.generateId(), createdAt: new Date(), updatedAt: null, deletedAt: null };
        this.addItem(newServicesType);
        return Promise.resolve(newServicesType);
    }

    public createTestServicesType(overrides: Partial<ServicesType> = {}): ServicesType {
        const defaultServicesType: ServicesType = {
            id: this.generateId(),
            serviceName: "Test Service",
            serviceCode: "TEST",
            createdAt: new Date(),
            updatedAt: null,
            deletedAt: null,
            ...overrides
        };
        this.addItem(defaultServicesType);
        return defaultServicesType;
    }

    public async findByServiceCode(serviceCode: string): Promise<ServicesType | null> {
        const servicesType = this.findByProperty('serviceCode', serviceCode) || null;
        return servicesType || null;
    }

    public async deleteFromId(id: string): Promise<void> {
        this.removeByProperty('id', id);
    }

    public async findById(id: string): Promise<ServicesType | null> {
        return this.findByProperty('id', id) && this.findByProperty('deletedAt', null) || null;
    }

    public updateFromId(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void> {
        const servicesTypeToUpdate = this.findByProperty('id', id) as ServicesType ;
        if (!servicesTypeToUpdate) {
            throw new Error('ServicesType not found');
        }
        Object.assign(servicesTypeToUpdate, servicesType);
        servicesTypeToUpdate.updatedAt = new Date();
        this.updateByProperty('id', id, servicesTypeToUpdate);
        return Promise.resolve();
    }
}
