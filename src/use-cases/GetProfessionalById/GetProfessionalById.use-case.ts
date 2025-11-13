import { TYPES } from '@container/types';
import { NotFoundException } from '@exceptions/notFound.exception';
import type { Professionals } from '@prisma/client';
import type { IProfessionalsRepository } from '@repositories/ProfessionalsRepository';
import { inject, injectable } from 'inversify';
import type { IGetProfessionalByIdUseCase } from './GetProfessionalById.interface';

@injectable()
export class GetProfessionalByIdUseCase implements IGetProfessionalByIdUseCase {
  constructor(
    @inject(TYPES.IProfessionalsRepository)
    private readonly professionalsRepository: IProfessionalsRepository,
  ) {}

  async execute(id: string): Promise<Professionals> {
    const professional = await this.professionalsRepository.findById(id);
    if (!professional) {
      throw new NotFoundException('Professional not found');
    }
    return professional;
  }
}
