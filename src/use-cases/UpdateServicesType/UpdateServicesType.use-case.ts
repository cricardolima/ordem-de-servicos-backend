import { injectable, inject } from "inversify";
import { IUpdateServicesTypeUseCase } from "./UpdateServicesType.interface";
import { TYPES } from "@container/types";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { IUpdateServicesTypeRequest } from "@dtos/models";
import { NotFoundException } from "@exceptions/notFound.exception";



@injectable()
export class UpdateServicesTypeUseCase implements IUpdateServicesTypeUseCase {
    constructor(@inject(TYPES.IServicesTypeRepository) private readonly servicesTypeRepository: IServicesTypeRepository) {}

    public async execute(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void> {
        const servicesTypeExists = await this.servicesTypeRepository.findById(id);
        if (!servicesTypeExists) {
            throw new NotFoundException("Service type not found");
        }

        const servicesTypeToUpdate = Object.assign(servicesTypeExists, { ...servicesType, updatedAt: new Date() });
        
        await this.servicesTypeRepository.updateFromId(id, servicesTypeToUpdate);
    }
}