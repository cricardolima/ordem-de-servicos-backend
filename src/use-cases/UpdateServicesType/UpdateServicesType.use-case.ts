import { TYPES } from '@container/types';
import type { IUpdateServicesTypeRequest } from '@dtos/models';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { inject, injectable } from 'inversify';
import type { IUpdateServicesTypeUseCase } from './UpdateServicesType.interface';

@injectable()
export class UpdateServicesTypeUseCase implements IUpdateServicesTypeUseCase {
  constructor(
    @inject(TYPES.IServicesTypeRepository)
    private readonly servicesTypeRepository: IServicesTypeRepository,
  ) {}

  public async execute(id: string, servicesType: IUpdateServicesTypeRequest): Promise<void> {
    const servicesTypeExists = await this.servicesTypeRepository.findById(id);
    if (!servicesTypeExists) {
      throw new NotFoundException('Service type not found');
    }

    const servicesTypeToUpdate = Object.assign(servicesTypeExists, {
      ...servicesType,
      updatedAt: new Date(),
    });

    await this.servicesTypeRepository.updateFromId(id, servicesTypeToUpdate);
  }
}
