import { ServicesType } from "@prisma/client";
import { ICreateServicesTypeRequest, IUpdateServicesTypeRequest } from "@dtos/models";

export interface IServicesTypeRepository {
    findAll(): Promise<ServicesType[]>;
    create(servicesType: ICreateServicesTypeRequest): Promise<ServicesType>;
    findByServiceCode(serviceCode: string): Promise<ServicesType | null>;
    deleteFromId(id: string): Promise<void>;
    findById(id: string): Promise<ServicesType | null>;
    updateFromId(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void>;
}