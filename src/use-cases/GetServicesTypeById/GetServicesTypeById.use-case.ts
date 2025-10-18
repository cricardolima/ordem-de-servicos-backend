import { injectable, inject } from "inversify";
import { IGetServicesTypeByIdUseCase } from "./GetServicesTypeById.interface";
import { TYPES } from "@container/types";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { ServicesType } from "@prisma/client";
import { NotFoundException } from "@exceptions/notFound.exception";

@injectable()
export class GetServicesTypeByIdUseCase implements IGetServicesTypeByIdUseCase {
    constructor(@inject(TYPES.IServicesTypeRepository) private readonly servicesTypeRepository: IServicesTypeRepository) {}

    public async execute(id: string): Promise<ServicesType> {
        const servicesType = await this.servicesTypeRepository.findById(id);
        if (!servicesType) {
            throw new NotFoundException("Services type not found");
        }
        return servicesType;
    }
}