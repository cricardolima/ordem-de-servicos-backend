import { inject, injectable } from "inversify";
import { IGetServicesTypeUseCase } from "@use-cases/GetServicesType/GetServicesType.interface";
import { TYPES } from "@container/types";
import { IServicesTypeRepository } from "@repositories/ServicesTypeRepository";
import { ServicesType } from "@prisma/client";

@injectable()
export class GetServicesTypeUseCase implements IGetServicesTypeUseCase {
    constructor(
        @inject(TYPES.IServicesTypeRepository)
        private readonly servicesTypeRepository: IServicesTypeRepository
    ) {}

    public async execute(): Promise<ServicesType[]> {
        return await this.servicesTypeRepository.findAll();
    }
}