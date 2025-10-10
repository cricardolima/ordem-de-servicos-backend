import { injectable, inject } from "inversify";
import { IDeleteServiceTypeUseCase } from "./DeleteServiceType.interface";
import { TYPES } from "@container/types";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { NotFoundException } from "@exceptions/notFound.exception";


@injectable()
export class DeleteServiceTypeUseCase implements IDeleteServiceTypeUseCase {
    constructor(@inject(TYPES.IServicesTypeRepository) private readonly servicesTypeRepository: IServicesTypeRepository) {}

    public async execute(id: string): Promise<void> {
        const servicesType = await this.servicesTypeRepository.findById(id);
        if (!servicesType) {
            throw new NotFoundException("Service type not found");
        }
        await this.servicesTypeRepository.deleteFromId(id);
    }
}