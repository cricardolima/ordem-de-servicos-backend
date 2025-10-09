import { ServicesType } from "@prisma/client";
import { ICreateServicesTypeRequest } from "@dtos/models";

export interface IServicesTypeRepository {
    findAll(): Promise<ServicesType[]>;
    create(servicesType: ICreateServicesTypeRequest): Promise<ServicesType>;
    findByServiceCode(serviceCode: string): Promise<ServicesType | null>;
}