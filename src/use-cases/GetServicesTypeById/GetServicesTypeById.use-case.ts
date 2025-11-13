import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { ServicesType } from '@prisma/client';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { inject, injectable } from 'inversify';
import type { IGetServicesTypeByIdUseCase } from './GetServicesTypeById.interface';

@injectable()
export class GetServicesTypeByIdUseCase implements IGetServicesTypeByIdUseCase {
  constructor(
    @inject(TYPES.IServicesTypeRepository)
    private readonly servicesTypeRepository: IServicesTypeRepository,
  ) {}

  public async execute(id: string): Promise<ServicesType> {
    const servicesType = await this.servicesTypeRepository.findById(id);
    if (!servicesType) {
      throw new NotFoundException('Services type not found');
    }
    return servicesType;
  }
}
