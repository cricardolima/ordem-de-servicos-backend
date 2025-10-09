import { ServicesType } from "@prisma/client";
import { ICreateServicesTypeRequest } from "@dtos/models";

export interface ICreateServicesTypeUseCase {
    execute(servicesType: ICreateServicesTypeRequest): Promise<ServicesType>;
}