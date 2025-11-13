import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { IServicesTypeRepository } from '@repositories/ServicesTypeRepository';
import { inject, injectable } from 'inversify';
import type { IDeleteServiceTypeUseCase } from './DeleteServiceType.interface';

@injectable()
export class DeleteServiceTypeUseCase implements IDeleteServiceTypeUseCase {
  constructor(
    @inject(TYPES.IServicesTypeRepository)
    private readonly servicesTypeRepository: IServicesTypeRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const servicesType = await this.servicesTypeRepository.findById(id);
    if (!servicesType) {
      throw new NotFoundException('Service type not found');
    }
    await this.servicesTypeRepository.deleteFromId(id);
  }
}
