import { ServicesType } from "@prisma/client";

export interface IServicesTypeRepository {
    findAll(): Promise<ServicesType[]>;
}