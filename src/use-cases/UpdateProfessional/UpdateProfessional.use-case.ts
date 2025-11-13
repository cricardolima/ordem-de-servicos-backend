import { TYPES } from '@container/types';
import type { ISession, IUpdateProfessionalsRequest } from '@dtos/models';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { inject, injectable } from 'inversify';
import type { IUpdateProfessionalUseCase } from './UpdateProfessional.interface';

@injectable()
export class UpdateProfessionalUseCase implements IUpdateProfessionalUseCase {
  constructor(
    @inject(TYPES.IProfessionalsRepository)
    private readonly professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(id: string, session: ISession, professional: IUpdateProfessionalsRequest): Promise<void> {
    const professionalExists = await this.professionalsRepository.findById(id);
    if (!professionalExists) {
      throw new NotFoundException('Professional not found');
    }

    const professionalToUpdate = {
      ...professional,
      updatedById: session.userId,
      updatedAt: new Date(),
    };

    await this.professionalsRepository.update(id, professionalToUpdate);
  }
}
