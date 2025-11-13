import { TYPES } from '@container/types';
import type { ServicesType } from '@prisma/client';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import type { IGetServicesTypeUseCase } from '@use-cases/GetServicesType/GetServicesType.interface';
import { inject, injectable } from 'inversify';

@injectable()
export class GetServicesTypeUseCase implements IGetServicesTypeUseCase {
  constructor(
    @inject(TYPES.IServicesTypeRepository)
    private readonly servicesTypeRepository: IServicesTypeRepository,
  ) {}

  public async execute(): Promise<ServicesType[]> {
    return await this.servicesTypeRepository.findAll();
  }
}
