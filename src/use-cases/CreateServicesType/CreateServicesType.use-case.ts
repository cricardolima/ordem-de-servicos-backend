import { TYPES } from '@container/types';
import type { ICreateServicesTypeRequest } from '@dtos/models';
import { BusinessException } from '@exceptions/business.exception';
import type { ServicesType } from '@prisma/client';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { inject, injectable } from 'inversify';
import type { ICreateServicesTypeUseCase } from './CreateServicesType.interface';

@injectable()
export class CreateServicesTypeUseCase implements ICreateServicesTypeUseCase {
  constructor(
    @inject(TYPES.IServicesTypeRepository)
    private readonly servicesTypeRepository: IServicesTypeRepository,
  ) {}

  public async execute(servicesType: ICreateServicesTypeRequest): Promise<ServicesType> {
    const servicesTypeExists = await this.servicesTypeRepository.findByServiceCode(servicesType.serviceCode);
    if (servicesTypeExists) {
      throw new BusinessException('Service type already exists');
    }

    return await this.servicesTypeRepository.create(servicesType);
  }
}
