import { TYPES } from '@container/types';
import type { ISession } from '@dtos/models';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { inject, injectable } from 'inversify';
import type { IDeleteProfessionalUseCase } from './DeleteProfessional.interface';

@injectable()
export class DeleteProfessionalUseCase implements IDeleteProfessionalUseCase {
  constructor(
    @inject(TYPES.IProfessionalsRepository)
    private readonly professionalsRepository: IProfessionalsRepository,
  ) {}

  public async execute(id: string, session: ISession): Promise<void> {
    const professional = await this.professionalsRepository.findById(id);
    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    await this.professionalsRepository.deleteFromId(id, session);
  }
}
