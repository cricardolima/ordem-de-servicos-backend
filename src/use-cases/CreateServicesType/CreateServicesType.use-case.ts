import { injectable, inject } from "inversify";
import { ICreateServicesTypeUseCase } from "./CreateServicesType.interface";
import { TYPES } from "@container/types";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { ServicesType } from "@prisma/client";
import { ICreateServicesTypeRequest } from "@dtos/models";
import { BusinessException } from "@exceptions/business.exception";


@injectable()
export class CreateServicesTypeUseCase implements ICreateServicesTypeUseCase {
    constructor(@inject(TYPES.IServicesTypeRepository) private readonly servicesTypeRepository: IServicesTypeRepository) {}

    public async execute(servicesType: ICreateServicesTypeRequest): Promise<ServicesType> {
        const servicesTypeExists = await this.servicesTypeRepository.findByServiceCode(servicesType.serviceCode);
        if (servicesTypeExists) {
            throw new BusinessException("Services type already exists");
        }
        
        return await this.servicesTypeRepository.create(servicesType);
    }
}